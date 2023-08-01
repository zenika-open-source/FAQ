import PropTypes from 'prop-types'

import { getIntl } from 'services'

import Dropdown, { DropdownItem } from 'components/Dropdown'

import Button from 'components/Button'

const LanguageDropdown = ({ onLanguageChanged = () => {}, primary = false, originalLanguage }) => {
  const intl = getIntl(LanguageDropdown)

  return (
    <div className="translate">
      <Dropdown
        button={<Button icon="translate" intent={primary ? 'primary' : 'link'} size="small" />}
      >
        <DropdownItem onClick={() => onLanguageChanged('fr')}>
          {intl('french')} {originalLanguage === 'fr' && '(original)'}
        </DropdownItem>
        <DropdownItem onClick={() => onLanguageChanged('en')}>
          {intl('english')} {originalLanguage === 'en' && '(original)'}
        </DropdownItem>
      </Dropdown>
    </div>
  )
}

LanguageDropdown.propTypes = {
  onLanguageChanged: PropTypes.func,
  primary: PropTypes.bool,
  originalLanguage: PropTypes.string,
}

LanguageDropdown.translations = {
  en: { french: 'French', english: 'English' },
  fr: { french: 'Français', english: 'Anglais' },
}

export default LanguageDropdown
