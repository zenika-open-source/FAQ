import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

import Button from 'react-toolbox/lib/button/Button'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'

import Searchbar from './components/Searchbar'
import NodeCard from './components/NodeCard'

import { search } from './actions'

import './style.css'

const TooltipButton = Tooltip()(Button)

const getAllNodes = gql`
  query {
    allZNodes {
      id
      question {
        id
        title
      }
      answer {
        id
        content
      }
    }
  }
`

class Home extends Component {
  render () {
    const { searchText, searchAction } = this.props
    const { loading, error, allZNodes } = this.props.data

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>Error :(</div>
    }

    const nodes = allZNodes

    const NodeCards = nodes.map(node => {
      return <NodeCard node={node} key={node.id} />
    })

    let Results

    if (searchText === '') {
      Results = (
        <div>
          <p className="indication">Latest question</p>
          {NodeCards}
        </div>
      )
    } else if (nodes.length === 0) {
      Results = (
        <p className="indication" style={{ textAlign: 'center' }}>
          Nothing found &nbsp;<i className="material-icons">sms_failed</i>
        </p>
      )
    } else {
      Results = (
        <div>
          <p className="indication">
            {nodes.length} result{nodes.length > 1 ? 's' : ''} found
          </p>
          {NodeCards}
        </div>
      )
    }

    return (
      <div className="Home">
        <h1 style={{ textAlign: 'center' }}>FAQ Zenika</h1>
        <Searchbar
          text={searchText}
          search={searchAction}
          style={{ marginTop: '3rem', marginBottom: '2rem' }}
        />
        <div>{Results}</div>
        <Link to="/new">
          <TooltipButton
            icon="add"
            tooltip="Ask a new question"
            floating
            accent
            mini
            style={{
              position: 'fixed',
              bottom: '1rem',
              right: '1rem'
            }}
          />
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  searchText: state.scenes.home.text
})

const mapDispatchToProps = dispatch => ({
  searchAction: bindActionCreators(search, dispatch)
})

export default graphql(getAllNodes)(
  connect(mapStateToProps, mapDispatchToProps)(Home)
)
