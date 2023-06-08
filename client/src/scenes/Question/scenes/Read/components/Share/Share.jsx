import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'

import { useConfiguration } from 'contexts'
import { routing, getIntl } from 'services'

import Dropdown, { DropdownItem } from 'components/Dropdown'

import Button from 'components/Button'

import './Share.css'

const Share = ({ node }) => {
  const intl = getIntl(Share)

  const conf = useConfiguration()
  const shareUrl = routing.getShareUrl(node.id)

  return (
    <div className="share">
      <Dropdown button={<Button icon="share" link style={{ padding: '0.2rem' }} />}>
        {conf.workplaceSharing ? (
          <DropdownItem
            icon={
              <img
                src="/img/brands/workplace.png"
                alt="workplace logo"
                style={{ height: '20px', width: '20px', margin: '0 2px' }}
              />
            }
            onClick={() => {
              let url =
                'https://work.facebook.com/sharer.php?display=popup&u=' +
                shareUrl +
                '&quote=' +
                encodeURI(node.question.title)
              let options = 'toolbar=0,status=0,resizable=1,width=626,height=436'
              window.open(url, 'sharer', options)
            }}
          >
            Workplace
          </DropdownItem>
        ) : null}
        <DropdownItem icon="link" onClick={() => copy(shareUrl)}>
          {intl('copy')}
        </DropdownItem>
      </Dropdown>
    </div>
  )
}

Share.propTypes = {
  node: PropTypes.object.isRequired
}

Share.translations = {
  en: { copy: 'Copy link' },
  fr: { copy: 'Copier lien' }
}

export default Share
