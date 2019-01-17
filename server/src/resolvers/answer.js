const { history, ctxUser } = require('./helpers')
const { algolia, mailgun } = require('./integrations')

module.exports = {
  Mutation: {
    createAnswerAndSources: async (
      _,
      { content, sources, nodeId },
      ctx,
      info
    ) => {
      sources = JSON.parse(sources)

      let answer

      // Imports the Google Cloud client library
      const { Translate } = require('@google-cloud/translate');

      // Your Google Cloud Platform project ID
      const projectId = 'YOUR_PROJECT_ID';

      // Instantiates a client
      const translate = new Translate({
        projectId: projectId,
      });

      // Creation contentTab
      const contentTab = [];

      // The text to translate
      const text = content;

      // The target language
      const targeten = 'en';
      const targetfr = 'fr';

      // Translates some text into English
      await translate
        .translate(text, targeten)
        .then(results => {
          const translationen = results[0];
          contentTab.push({ text: translationen, lang: targeten });

          console.log(`Text: ${text}`);
          console.log(`Translation en: ${translationen}`);
        })

      await translate
        .translate(text, targetfr)
        .then(resultsfr => {
          const translationfr = resultsfr[0];
          contentTab.push({ text: translationfr, lang: targetfr });

          console.log(`Translation fr : ${translationfr}`);
        })

      try {
        answer = await ctx.prisma.mutation.createAnswer(
          {
            data: {
              content,
              node: {
                connect: {
                  id: nodeId
                }
              },
              user: {
                connect: {
                  id: ctxUser(ctx).id
                }
              },
              sources: {
                create: sources
              },
              contentTranslations: {
                create: contentTab
              }
            }
          },
          `
        {
          id
          node {
            flags(where:{type:"unanswered"}) {
              id
            }
          }
        }
        `
        )
      } catch (e) {
        // The error doesn't includes the error code, so we use the message
        if (e.message.includes('NodeAnswer') && e.message.includes('violate')) {
          throw new Error(
            'Someone already answered this question! Refresh this page.'
          )
        }
        throw e
      }

      await ctx.prisma.mutation.deleteManyFlags({
        where: { node: { id: nodeId }, type: 'unanswered' }
      })

      await history.push(ctx, {
        action: 'CREATED',
        model: 'Answer',
        meta: {
          content,
          sources
        },
        nodeId
      })

      algolia.updateNode(ctx, nodeId)
      mailgun.sendNewAnswer(ctx, nodeId)

      return ctx.prisma.query.answer(
        {
          where: { id: answer.id }
        },
        info
      )
    },
    updateAnswerAndSources: async (_, { id, content, sources }, ctx, info) => {
      // Imports the Google Cloud client library
      const { Translate } = require('@google-cloud/translate');

      // Your Google Cloud Platform project ID
      const projectId = 'YOUR_PROJECT_ID';

      // Instantiates a client
      const translate = new Translate({
        projectId: projectId,
      });

      // Creation contentTab
      const contentTab = [];

      // The text to translate
      const text = content;

      // The target language
      const targeten = 'en';
      const targetfr = 'fr';

      // Translates some text into English
      await translate
        .translate(text, targeten)
        .then(results => {
          const translationen = results[0];
          contentTab.push({ text: translationen, lang: targeten });

          console.log(`Text: ${text}`);
          console.log(`Translation en: ${translationen}`);
        })

      await translate
        .translate(text, targetfr)
        .then(resultsfr => {
          const translationfr = resultsfr[0];
          contentTab.push({ text: translationfr, lang: targetfr });

          console.log(`Translation fr : ${translationfr}`);
        })

      const answer = await ctx.prisma.query.answer(
        { where: { id } },
        `
        {
          id
          content
          sources {
            id
            label
            url
          }
          node {
            id
          }
        }
        `
      )

      const oldSources = answer.sources
      const newSources = JSON.parse(sources)

      const sourcesToAdd = newSources.filter(
        newSource => !oldSources.map(s => s.id).includes(newSource.id)
      )
      const sourcesToUpdate = newSources.filter(newSource => {
        if (oldSources.map(s => s.id).includes(newSource.id)) {
          const oldSource = oldSources.filter(s => s.id === newSource.id)[0]

          return (
            oldSource.label !== newSource.label ||
            oldSource.url !== newSource.url
          )
        }
        return false
      })
      const sourcesToRemove = oldSources.filter(
        oldSource => !newSources.map(s => s.id).includes(oldSource.id)
      )

      const mutationsToAdd = sourcesToAdd.map(({ label, url }) =>
        ctx.prisma.mutation.createSource({
          data: {
            label,
            url,
            answer: { connect: { id: answer.id } }
          }
        })
      )

      const mutationsToUpdate = sourcesToUpdate.map(({ id, label, url }) =>
        ctx.prisma.mutation.updateSource({
          where: { id },
          data: {
            label,
            url
          }
        })
      )

      const mutationsToRemove = sourcesToRemove.map(source =>
        ctx.prisma.mutation.deleteSource({ where: { id: source.id } })
      )

      await Promise.all([
        ...mutationsToAdd,
        ...mutationsToUpdate,
        ...mutationsToRemove
      ])

      const clean = sources =>
        sources.map(s => ({ label: s.label, url: s.url }))

      const meta = {
        sourcesChanges: {
          added: clean(sourcesToAdd),
          updated: clean(sourcesToUpdate),
          removed: clean(sourcesToRemove)
        }
      }

      if (content !== answer.content) {
        meta.content = content
      }

      await ctx.prisma.mutation.updateAnswer({
        where: { id },
        data: {
          content,
          contentTranslations: {
            create: contentTab
          }
        }
      })

      await history.push(ctx, {
        action: 'UPDATED',
        model: 'Answer',
        meta,
        nodeId: answer.node.id
      })

      algolia.updateNode(ctx, answer.node.id)

      return ctx.prisma.query.answer(
        {
          where: { id }
        },
        info
      )
    }
  }
}
