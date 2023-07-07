import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'

import { getIntl } from 'services'

import Avatar from 'components/Avatar'

import './Meta.css'

const Meta = ({ node }) => {
  const intl = getIntl(Meta)

  return (
    <div className="read-meta">
      <div className="asked">
        <Avatar
          image={node.question.user.picture}
          style={{ width: '30px', height: '30px', marginRight: '0.5rem' }}
        />
        <div>
          {intl('asked')} {node.question.user.name}
          <br />
          {format(new Date(node.question.createdAt), 'P')}
        </div>
      </div>
      {node.answer && (
        <div className="answered">
          <div>
            {intl('answered')} {node.answer.user.name}
            <br />
            {format(new Date(node.answer.createdAt), 'P')}
          </div>
          <Avatar
            image={node.answer.user.picture}
            style={{ width: '30px', height: '30px', marginLeft: '0.5rem' }}
          />
        </div>
      )}
    </div>
  )
}

Meta.propTypes = {
  node: PropTypes.object.isRequired
}

Meta.translations = {
  en: { asked: 'Asked by', answered: 'Answer by' },
  fr: { asked: 'Posée par', answered: 'Répondue par' }
}

export default Meta
