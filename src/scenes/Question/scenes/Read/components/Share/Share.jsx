import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'

import Dropdown, { DropdownItem } from 'components/Dropdown'

import Button from 'components/Button'

import './Share.css'

const Share = props => (
  <div className="share">
    <Dropdown
      button={<Button icon="share" link style={{ padding: '0.2rem' }} />}
    >
      <DropdownItem
        icon={<i className="fab fa-facebook" />}
        onClick={() => {
          let url =
            'https://work.facebook.com/sharer.php?display=popup&u=' +
            window.location.href +
            '&quote=' +
            encodeURI(props.node.question.title)
          let options = 'toolbar=0,status=0,resizable=1,width=626,height=436'
          window.open(url, 'sharer', options)
        }}
      >
        Workplace
      </DropdownItem>
      <DropdownItem icon="link" onClick={() => copy(window.location.href)}>
        Copy link
      </DropdownItem>
    </Dropdown>
  </div>
)

Share.propTypes = {
  node: PropTypes.object.isRequired
}

export default Share
