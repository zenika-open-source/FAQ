import Button from 'components/Button'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getIntl } from 'services'

const ActionMenu = ({ backLabel, backLink, goBack, title, children }) => {
  const intl = getIntl(ActionMenu)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center mb-1">
      <div className="flex-1">
        {goBack && location.state && location.state.from === 'home' ? (
          <Button
            icon="chevron_left"
            label={backLabel || intl('back')}
            intent="link"
            action="raised"
            size="medium"
            onClick={() => navigate(-1)}
          />
        ) : (
          <Link to={backLink}>
            <Button
              icon="chevron_left"
              label={backLabel || intl('back')}
              intent="link"
              action="raised"
              size="medium"
            />
          </Link>
        )}
      </div>
      <div className="title">
        <h2>{title}</h2>
      </div>
      <div className="flex flex-1 justify-end">{children}</div>
    </div>
  )
}

ActionMenu.propTypes = {
  backLink: PropTypes.string.isRequired,
  backLabel: PropTypes.string,
  goBack: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
}

ActionMenu.translations = {
  en: { back: 'Back' },
  fr: { back: 'Retour' },
}

export default ActionMenu
