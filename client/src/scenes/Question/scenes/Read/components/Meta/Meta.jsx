import PropTypes from 'prop-types'
import format from 'date-fns/format'

import { getIntl } from 'services'

import Avatar from 'components/Avatar'

const Meta = ({ node }) => {
  const intl = getIntl(Meta)

  return (
    <div className="p-2 flex justify-between text-sm text-secondary-font-light">
      <div className="max-w-[45%] flex">
        <Avatar image={node.question.user.picture} className="w-8 h-8 mr-2" />
        <div>
          {intl('asked')} {node.question.user.name}
          <br />
          {format(new Date(node.question.createdAt), 'P')}
        </div>
      </div>
      {node.answer && (
        <div className="max-w-[45%] flex text-right">
          <div>
            {intl('answered')} {node.answer.user.name}
            <br />
            {format(new Date(node.answer.createdAt), 'P')}
          </div>
          <Avatar image={node.answer.user.picture} className="w-8 h-8 ml-2" />
        </div>
      )}
    </div>
  )
}

Meta.propTypes = {
  node: PropTypes.object.isRequired,
}

Meta.translations = {
  en: { asked: 'Asked by', answered: 'Answer by' },
  fr: { asked: 'Posée par', answered: 'Répondue par' },
}

export default Meta
