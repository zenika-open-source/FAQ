const { history, ctxUser, slugify } = require('./helpers')
const { algolia, slack } = require('./integrations')

const confTagList = ctx =>
  Object.values(ctx.prisma._meta.configuration.tags).reduce(
    (acc, x) => acc.concat(x),
    []
  )

module.exports = {
  Query: {
    zNode: (_, args, ctx, info) => ctx.prisma.query.zNode(args, info)
  },
  Mutation: {
    createQuestionAndTags: async (_, { title, tags }, ctx, info) => {
      const tagList = confTagList(ctx)

      // Imports the Google Cloud client library
      const { Translate } = require('@google-cloud/translate');

      // Your Google Cloud Platform project ID
      const projectId = 'YOUR_PROJECT_ID';

      // Instantiates a client
      const translate = new Translate({
        projectId: projectId,
      });

      // Creation titleTab
      const titleTab = [];

      // The text to translate
      const text = title;

      // The target language
      const targeten = 'en';
      const targetfr = 'fr';

      // Translates some text into English
      await translate
        .translate(text, targeten)
        .then(results => {
          const translationen = results[0];
          titleTab.push({ text: translationen, lang: targeten });

          console.log(`Text: ${text}`);
          console.log(`Translation en: ${translationen}`);
        })

      await translate
        .translate(text, targetfr)
        .then(resultsfr => {
          const translationfr = resultsfr[0];
          titleTab.push({ text: translationfr, lang: targetfr });

          console.log(`Translation fr : ${translationfr}`);
        })


        .catch(err => {
          console.error('ERROR:', err);
        });
      const node = await ctx.prisma.mutation.createZNode(
        {
          data: {
            question: {
              create: {
                title,
                slug: slugify(title),
                user: { connect: { id: ctxUser(ctx).id } },
                titleTranslations: {
                  create: {
                    text: titleTab[0].text,
                    lang: titleTab[0].lang
                  }
                }
              }
            },
            tags: {
              create: tags
                .filter(label => tagList.includes(label))
                .map(label => ({
                  label,
                  user: { connect: { id: ctxUser(ctx).id } }
                }))
            },
            flags: {
              create: {
                type: 'unanswered',
                user: { connect: { id: ctxUser(ctx).id } }
              }
            }
          }
        },
        `
        {
          id
          question {
            id
          }
        }
        `
      )

      await history.push(ctx, {
        action: 'CREATED',
        model: 'Question',
        meta: { title, tags },
        nodeId: node.id
      })

      algolia.addNode(ctx, node.id)
      slack.sendToChannel(ctx, node.id)

      return ctx.prisma.query.question(
        { where: { id: node.question.id } },
        info
      )
    },
    updateQuestionAndTags: async (_, { id, title, tags }, ctx, info) => {
      const tagList = confTagList(ctx)

      // Imports the Google Cloud client library
      const { Translate } = require('@google-cloud/translate');

      // Your Google Cloud Platform project ID
      const projectId = 'YOUR_PROJECT_ID';

      // Instantiates a client
      const translate = new Translate({
        projectId: projectId,
      });

      // Creation titleTab
      const titleTab = [];

      // The text to translate
      const text = title;

      // The target language
      const targeten = 'en';
      const targetfr = 'fr';

      // Translates some text into English
      await translate
        .translate(text, targeten)
        .then(results => {
          const translationen = results[0];
          titleTab.push({ text: translationen, lang: targeten });

          console.log(`Text: ${text}`);
          console.log(`Translation en: ${translationen}`);
        })

      await translate
        .translate(text, targetfr)
        .then(resultsfr => {
          const translationfr = resultsfr[0];
          titleTab.push({ text: translationfr, lang: targetfr });

          console.log(`Translation fr : ${translationfr}`);
        })

      const node = (await ctx.prisma.query.question(
        { where: { id } },
        `
        {
          node {
            id
            question {
              title
            }
            tags {
              id
              label
            }
          }
        }
        `
      )).node

      const oldTags = node.tags
      const newTags = tags

      const tagsToAdd = newTags.filter(
        newTag => !oldTags.map(t => t.label).includes(newTag)
      )
      const tagsToRemove = oldTags.filter(
        oldTag => !newTags.includes(oldTag.label)
      )

      const mutationsToAdd = tagsToAdd
        .filter(label => tagList.includes(label))
        .map(label =>
          ctx.prisma.mutation.createTag({
            data: {
              label,
              node: { connect: { id: node.id } },
              user: { connect: { id: ctxUser(ctx).id } }
            }
          })
        )

      const mutationsToRemove = tagsToRemove.map(tag =>
        ctx.prisma.mutation.deleteTag({ where: { id: tag.id } })
      )

      await Promise.all([...mutationsToAdd, ...mutationsToRemove])

      const meta = {
        tagsChanges: {
          added: tagsToAdd,
          removed: tagsToRemove.map(t => t.label)
        }
      }

      if (title !== node.question.title) {
        meta.title = title
      }

      await ctx.prisma.mutation.updateQuestion({
        where: { id },
        data: {
          title,
          slug: slugify(title),
          titleTranslations: {
            create: {
              text: titleTab[0].text,
              lang: titleTab[0].lang
            }
          }
        }
      })

      await history.push(ctx, {
        action: 'UPDATED',
        model: 'Question',
        meta,
        nodeId: node.id
      })

      algolia.updateNode(ctx, node.id)

      return ctx.prisma.query.question(
        {
          where: { id }
        },
        info
      )
    }
  }
}