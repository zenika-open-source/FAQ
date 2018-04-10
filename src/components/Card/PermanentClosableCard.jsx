import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button'

import Card from './Card'
import CardActions from './CardActions'

class PermanentClosableCard extends Component {
  static setValue (name, value) {
    const json =
      JSON.parse(localStorage.getItem('permanent_closable_cards')) || {}
    json[name] = value
    localStorage.setItem('permanent_closable_cards', JSON.stringify(json))
  }

  static isOpen (name) {
    const json = JSON.parse(localStorage.getItem('permanent_closable_cards'))
    return json ? (json[name] !== undefined ? json[name] : true) : true
  }

  render () {
    const { open, close, children, ...otherProps } = this.props

    return (
      <Fragment>
        {open && (
          <Card {...otherProps}>
            <a
              style={{
                position: 'absolute',
                top: '0.3rem',
                right: '0.3rem',
                cursor: 'pointer'
              }}
              onClick={close}
            >
              <i className="material-icons">close</i>
            </a>
            {children}
            <CardActions>
              <Button secondary raised label="Understood!" onClick={close} />
            </CardActions>
          </Card>
        )}
      </Fragment>
    )
  }
}

PermanentClosableCard.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

export default PermanentClosableCard
