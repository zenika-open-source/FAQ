import PropTypes from 'prop-types'

import { getIntl } from '@services'

import Dropdown, { DropdownItem } from '@components/Dropdown'

import Button from 'components/Button'

import { handleTranslation } from 'helpers'

const Share = ({ node, setQuestionTitle, setAnswerContent }) => {
  const intl = getIntl(Share)

  const originalLanguage = node.question.language

  return (
    <div className="translate">
      <Dropdown button={<Button icon="translate" link style={{ padding: '0.2rem' }} />}>
        <DropdownItem
          onClick={() =>
            handleTranslation(originalLanguage, 'fr', node, setQuestionTitle, setAnswerContent)
          }
        >
          {intl('french')} {originalLanguage === 'fr' && '(original)'}
        </DropdownItem>
        <DropdownItem
          onClick={() =>
            handleTranslation(originalLanguage, 'en', node, setQuestionTitle, setAnswerContent)
          }
        >
          {intl('english')} {originalLanguage === 'en' && '(original)'}
        </DropdownItem>
      </Dropdown>
    </div>
  )
}

Share.propTypes = {
  node: PropTypes.object.isRequired
}

Share.translations = {
  en: { french: 'French', english: 'English' },
  fr: { french: 'Français', english: 'Anglais' }
}

export default Share