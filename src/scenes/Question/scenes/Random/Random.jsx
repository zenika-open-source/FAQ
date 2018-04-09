import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

import { getRandomNode } from './queries'

import Loading from 'components/Loading'

const Random = ({ data: { randomNode } }) => {
  if (randomNode) {
    if (randomNode.id) {
      return <Redirect to={`/q/${randomNode.id}`} />
    } else {
      return (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          There is no questions corresponding to your search. Try again later!
        </div>
      )
    }
  }

  return (
    <div>
      <Loading text="Unleashing the randomizator..." />
    </div>
  )
}

Random.propTypes = {
  data: PropTypes.object.isRequired
}

export default getRandomNode(Random)
