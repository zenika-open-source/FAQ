import './ActionMenu.css';

import Button from 'components/Button';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getIntl } from 'services';

const ActionMenu = ({ backLabel, backLink, goBack, title, children }) => {
  const intl = getIntl(ActionMenu)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="action-menu">
      <div className="back-btn">
        {goBack && location.state && location.state.from === 'home' ? (
          <Button
            icon="chevron_left"
            label={backLabel || intl('back')}
            link
            raised
            onClick={() => navigate(-1)}
          />
        ) : (
          <Link to={backLink}>
            <Button icon="chevron_left" label={backLabel || intl('back')} link raised />
          </Link>
        )}
      </div>
      <div className="title">
        <h2>{title}</h2>
      </div>
      <div className="actions">{children}</div>
    </div>
  )
}

ActionMenu.propTypes = {
  backLink: PropTypes.string.isRequired,
  backLabel: PropTypes.string,
  goBack: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node
}

ActionMenu.translations = {
  en: { back: 'Back' },
  fr: { back: 'Retour' }
}

export default ActionMenu
