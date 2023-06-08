import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getIntl } from 'services'

import Button from 'components/Button'

import Card from './Card'
import CardActions from './CardActions'

class PermanentClosableCard extends Component {
  static setValue(name, value) {
    const json = JSON.parse(localStorage.getItem('permanent_closable_cards')) || {}
    json[name] = value
    localStorage.setItem('permanent_closable_cards', JSON.stringify(json))
  }

  static isOpen(name) {
    const json = JSON.parse(localStorage.getItem('permanent_closable_cards'))
    return json ? (json[name] !== undefined ? json[name] : true) : true
  }

  render() {
    const intl = getIntl(PermanentClosableCard)

    const { open, close, children, ...otherProps } = this.props

    return (
      <>
        {open && (
          <Card {...otherProps}>
            <span
              style={{
                position: 'absolute',
                top: '0.3rem',
                right: '0.3rem',
                cursor: 'pointer'
              }}
              onClick={close}
            >
              <i className="material-icons">close</i>
            </span>
            {children}
            <CardActions>
              <Button secondary raised label={intl('understood')} onClick={close} />
            </CardActions>
          </Card>
        )}
      </>
    )
  }
}

PermanentClosableCard.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

PermanentClosableCard.translations = {
  en: { understood: 'Understood!' },
  fr: { understood: 'Compris !' }
}

export default PermanentClosableCard
