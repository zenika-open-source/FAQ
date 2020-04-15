import compact from 'lodash/compact'
import subMonths from 'date-fns/sub_months'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import format from 'date-fns/format'

import { markdown } from 'services'

const join = array => {
  array = compact(array)
  if (array.length <= 1) {
    return array.join('')
  }
  let last = array.pop()
  return array.join(', ') + ' and ' + last
}

const sentencer = (array, action, label, details) => {
  if (array && array.length > 0) {
    if (array.length === 1) {
      return `${action} ${details ? 'the' : 'one'} ${label}` + (details ? ` "${array[0]}"` : '')
    } else {
      return `${action} ${array.length} ${label}s` + (details ? ` (${join(array)})` : '')
    }
  }
  return ''
}

export const formatHistoryAction = (historyAction, options = { relative: true }) => {
  let { action, model, meta, user, createdAt, node } = historyAction
  meta = JSON.parse(meta)

  const what = options.relative
    ? 'this question'
    : `"${markdown.title(meta.title || node.question.title)}"`

  const sentences = {
    CREATED: {
      Question: () => join([`asked ${what}`, sentencer(meta.tags, 'added', 'tag', true)]),
      Answer: () => join([`answered ${what}`, sentencer(meta.sources, 'added', 'source')]),
      Flag: () => `flagged ${what} with "${meta.type}"`
    },
    UPDATED: {
      Question: () => {
        let s = []
        if (meta.title) {
          s.push(`edited ${what}`)
        }
        s.push(sentencer(meta.tagsChanges.added, 'added', 'tag', true))
        s.push(sentencer(meta.tagsChanges.removed, 'removed', 'tag', true))

        return join(s)
      },
      Answer: () => {
        let s = []
        if (meta.content) {
          s.push(`edited the answer of ${what}`)
        }
        s.push(sentencer(meta.sourcesChanges.added, 'added', 'source'))
        s.push(sentencer(meta.sourcesChanges.updated, 'updated', 'source'))
        s.push(sentencer(meta.sourcesChanges.removed, 'removed', 'source'))

        return join(s) + (meta.content ? '' : ` from ${what}`)
      }
    },
    DELETED: {
      Flag: () => `removed the flag "${meta.type}"` + (options.relative ? '' : ` from ${what}`)
    }
  }

  const icons = {
    CREATED: {
      Question: 'record_voice_over',
      Answer: 'feedback',
      Flag: 'flag'
    },
    UPDATED: {
      Question: meta.title ? 'edit' : 'local_offer',
      Answer: meta.content ? 'question_answer' : 'library_books'
    },
    DELETED: {
      Flag: 'outlined_flag'
    }
  }

  const monthOld = subMonths(new Date(), 1)

  const date =
    differenceInMilliseconds(createdAt, monthOld) > 0
      ? distanceInWordsToNow(createdAt, {
          addSuffix: true
        })
      : format(createdAt, 'D MMM YYYY, HH:mm')

  return {
    date,
    user,
    sentence: sentences[action][model](),
    icon: icons[action][model]
  }
}
