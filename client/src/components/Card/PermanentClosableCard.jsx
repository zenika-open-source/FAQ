import React from 'react'

import { useIntl } from 'services'

import Button from 'components/Button'

import Card from './Card'

const PermanentClosableCard = ({ opened, onClose, children, ...rest }) => {
  const intl = useIntl(PermanentClosableCard)

  return (
    <>
      {opened && (
        <Card {...rest}>
          <span
            style={{
              position: 'absolute',
              top: '0.3rem',
              right: '0.3rem',
              cursor: 'pointer'
            }}
            onClick={onClose}
          >
            <i className="material-icons">close</i>
          </span>
          {children}
          <Card.Actions>
            <Button secondary raised label={intl('understood')} onClick={onClose} />
          </Card.Actions>
        </Card>
      )}
    </>
  )
}

PermanentClosableCard.setOpened = (name, value) => {
  const json = JSON.parse(localStorage.getItem('permanent_closable_cards')) || {}
  json[name] = value
  localStorage.setItem('permanent_closable_cards', JSON.stringify(json))
}

PermanentClosableCard.isOpened = name => {
  const json = JSON.parse(localStorage.getItem('permanent_closable_cards'))
  return json ? (json[name] !== undefined ? json[name] : true) : true
}

PermanentClosableCard.translations = {
  en: { understood: 'Understood!' },
  fr: { understood: 'Compris !' }
}

export default PermanentClosableCard
