import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { graphql, withApollo } from 'react-apollo'
import { getAllNodes, getListNodes } from './queries'

import { flags, search } from 'services'

import Button from 'react-toolbox/lib/button/Button'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'

import Loading from 'components/Loading'

import Searchbar from './components/Searchbar'
import NodeCard from './components/NodeCard'

import './style.css'

const TooltipButton = Tooltip()(Button)

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: '',
      nodes: null
    }
  }

  handleSearchChange (value) {
    const apollo = this.props.client
    const self = this

    self.setState({ searchText: value })

    if (value !== '') {
      /* First you query Algolia, then you get the date from graphcool
				Graphcool resolvers are limited to scalar types, so we can't
				write a resolver which does both
				https://github.com/graphcool/graphcool-framework/issues/256 */
      search.simpleSearch(value, function searchDone (err, content) {
        if (err) {
          console.error(err)
          return
        }

        const ids = content.hits.map(h => h.objectID)

        apollo
          .query({
            query: getListNodes,
            variables: { ids }
          })
          .then(result => {
            self.setState({ nodes: result.data.allQuestions.map(q => q.node) })
          })
      })
    } else {
      self.setState({ nodes: null })
    }
  }

  render () {
    const { searchText, nodes } = this.state
    const { loading, error, allZNodes } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    const list = nodes || allZNodes

    const NodeCards = list.map(node => {
      return (
        <NodeCard node={node} key={node.id} style={{ marginBottom: '1rem' }} />
      )
    })

    let Results

    if (searchText === '') {
      Results = (
        <div>
          <p className="indication">Latest question</p>
          {NodeCards}
        </div>
      )
    } else if (list.length === 0) {
      Results = (
        <p className="indication" style={{ textAlign: 'center' }}>
          Nothing found &nbsp;<i className="material-icons">sms_failed</i>
        </p>
      )
    } else {
      Results = (
        <div>
          <p className="indication">
            {list.length} result{list.length > 1 ? 's' : ''} found
          </p>
          {NodeCards}
        </div>
      )
    }

    return (
      <div className="Home">
        <h1
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            alt=""
            src="/img/favicon/favicon-64.png"
            style={{ height: '30px', marginRight: '10px' }}
          />
          FAQ Zenika
        </h1>
        {flags.search && (
          <Searchbar
            text={searchText}
            search={this.handleSearchChange.bind(this)}
            style={{ marginTop: '3rem', marginBottom: '2rem' }}
          />
        )}
        <div>{Results}</div>
        {flags.question.new && (
          <Link to="/q/new">
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
        )}
      </div>
    )
  }
}

Home.propTypes = {
  data: PropTypes.object.isRequired
}

export default graphql(getAllNodes)(withApollo(Home))
