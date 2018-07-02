import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import compact from 'lodash/compact'

import Avatar from 'components/Avatar'

import './History.css'

const join = array => {
  array = compact(array)
  if (array.length <= 1) {
    return array.join('')
  }
  let last = array.pop()
  return array.join(', ') + ' and ' + last
}

const sentencer = (array, action, label, details) => {
  if (array.length > 0) {
    if (array.length === 1) {
      return (
        `${action} ${details ? 'the' : 'one'} ${label}` +
        (details ? ` "${array[0]}"` : '')
      )
    } else {
      return (
        `${action} ${array.length} ${label}s` +
        (details ? ` (${join(array)})` : '')
      )
    }
  }
  return ''
}

const format = historyAction => {
  const { action, model, meta, user, createdAt } = historyAction

  const sentences = {
    CREATED: {
      Question: () =>
        join([
          'asked this question',
          sentencer(meta.tags, 'added', 'tag', true)
        ]),
      Answer: () =>
        join([
          'answered this question',
          sentencer(meta.sources, 'added', 'source')
        ]),
      Flag: () => `flagged this question with "${meta.type}"`
    },
    UPDATED: {
      Question: () => {
        let s = []
        if (meta.title) {
          s.push('edited this question')
        }
        s.push(sentencer(meta.tagsChanges.added, 'added', 'tag', true))
        s.push(sentencer(meta.tagsChanges.removed, 'removed', 'tag', true))

        return join(s)
      },
      Answer: () => {
        let s = []
        if (meta.content) {
          s.push('edited this answer')
        }
        s.push(sentencer(meta.sourcesChanges.added, 'added', 'source'))
        s.push(sentencer(meta.sourcesChanges.updated, 'updated', 'source'))
        s.push(sentencer(meta.sourcesChanges.deleted, 'deleted', 'source'))

        return join(s)
      }
    },
    DELETED: {
      Flag: () => `removed the flag "${meta.type}"`
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

  const createdDate = moment(createdAt)
  const monthOld = moment().subtract(1, 'month')

  const date =
    createdDate.diff(monthOld) > 0
      ? createdDate.fromNow()
      : createdDate.format('D MMM YYYY, HH:mm')

  return {
    date,
    user,
    sentence: sentences[action][model](),
    icon: icons[action][model]
  }
}

const HistoryAction = ({ action }) => {
  action = format(action)

  return (
    <div className="history-action">
      <div
        style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
      >
        <div>
          <i className="material-icons">{action.icon}</i>
        </div>
        <div>
          <Avatar
            image={action.user.picture}
            style={{ width: '25px', minWidth: '25px' }}
          />
        </div>
        <div>
          {action.user.name} {action.sentence}.
        </div>
      </div>
      <div style={{ minWidth: '150px', textAlign: 'right' }}>
        <i>{action.date}</i>
      </div>
    </div>
  )
}

HistoryAction.propTypes = {
  action: PropTypes.object.isRequired
}

export default HistoryAction
