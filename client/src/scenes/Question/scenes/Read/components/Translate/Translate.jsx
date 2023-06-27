import PropTypes from 'prop-types'

import { getIntl } from 'services'

import Dropdown, { DropdownItem } from 'components/Dropdown'

import Button from 'components/Button'

import { handleTranslation } from 'helpers'

const Translate = ({ node, setQuestionTitle, setAnswerContent, isTranslated, setIsTranslated }) => {
  const intl = getIntl(Translate)

  const originalQuestionLanguage = node.question.language
  const originalAnswerLanguage = node.answer && node.answer.language

  const translate = language => {
    const content = handleTranslation(
      originalQuestionLanguage,
      originalAnswerLanguage,
      language,
      node
    )
    setQuestionTitle(content.question)
    setAnswerContent(content.answer)
    setIsTranslated(content.isTranslation)
  }

  return (
    <div className="translate">
      <Dropdown
        button={
          <Button
            id={isTranslated ? 'hoveredBtn' : ''}
            icon="translate"
            link
            style={{ padding: '0.2rem' }}
          />
        }
      >
        <DropdownItem onClick={() => translate('fr')}>
          {intl('french')} {originalQuestionLanguage === 'fr' && '(original)'}
        </DropdownItem>
        <DropdownItem onClick={() => translate('en')}>
          {intl('english')} {originalQuestionLanguage === 'en' && '(original)'}
        </DropdownItem>
      </Dropdown>
    </div>
  )
}

Translate.propTypes = {
  node: PropTypes.object.isRequired
}

Translate.translations = {
  en: { french: 'French', english: 'English' },
  fr: { french: 'Français', english: 'Anglais' }
}

export default Translate
