import PropTypes from 'prop-types'

import { formatHistoryAction } from 'helpers'

import Avatar from 'components/Avatar'

import './History.css'

const HistoryAction = ({ action }) => {
  action = formatHistoryAction(action)

  return (
    <div className="flex w-full items-center justify-between p-2">
      <div className="flex items-center flex-row gap-2">
        <div>
          <i className="material-icons">{action.icon}</i>
        </div>
        <div>
          <Avatar image={action.user.picture} className="w-6 min-w-[24px]" />
        </div>
        <div>
          {action.user.name} {action.sentence}.
        </div>
      </div>
      <div className="min-w-[150px] text-right">
        <i>{action.date}</i>
      </div>
    </div>
  )
}

HistoryAction.propTypes = {
  action: PropTypes.object.isRequired,
}

export default HistoryAction
