import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import IconMenu from 'react-toolbox/lib/menu/IconMenu'
import MenuItem from 'react-toolbox/lib/menu/MenuItem'

import { flags } from 'services'

class OptionsMenu extends Component {
  render () {
    const { node, history, match } = this.props

    return (
      <IconMenu
        style={{
          float: 'right',
          position: 'absolute',
          right: '5px',
          top: '15px'
        }}
      >
        <MenuItem
          icon="edit"
          caption="Edit question"
          onClick={() => history.push(`/q/${match.params.slug}/edit`)}
          disabled={!flags.question.edit}
        />
        <MenuItem
          icon="question_answer"
          caption="Edit answer"
          onClick={() => history.push(`/q/${match.params.slug}/answer`)}
          disabled={
            !node.answer || !flags.question.answer || !flags.question.edit
          }
        />
      </IconMenu>
    )
  }
}

OptionsMenu.propTypes = {
  node: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(OptionsMenu)
