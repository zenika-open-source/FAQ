import React from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'

import { useIntl, useConfiguration } from 'services'

import { Dropdown, Button } from 'components'

import './Share.css'

const Share = ({ node }) => {
  const intl = useIntl(Share)

  const conf = useConfiguration()
  const shareUrl = `${window.location.origin}/q/${node.id}`

  return (
    <div className="share">
      <Dropdown button={<Button icon="share" link style={{ padding: '0.2rem' }} />}>
        {conf.workplaceSharing ? (
          <Dropdown.Item
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
          </Dropdown.Item>
        ) : null}
        <Dropdown.Item icon="link" onClick={() => copy(shareUrl)}>
          {intl('copy')}
        </Dropdown.Item>
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
