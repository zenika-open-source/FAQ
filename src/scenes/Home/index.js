import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'

import { getAllNodes } from './queries'

import { flags, search } from 'services'

import Button from 'react-toolbox/lib/button/Button'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'
import Pluralize from 'react-pluralize'

import Loading from 'components/Loading'

import Searchbar from './components/Searchbar'
import NodeCard from './components/NodeCard'

import './style.css'

const TooltipButton = Tooltip()(Button)

class Home extends Component {
  constructor (props) {
    super(props)

    const searchText = this.getSearchFromURL(props)

    this.state = {
      searchText: searchText || '',
      searchLoading: false,
      answeredOnly: false,
      nodes: null
    }
  }

  getSearchFromURL (props) {
    const { location } = props
    const queryParams = new URLSearchParams(location.search)
    return queryParams.get('q')
  }

  componentDidMount () {
    const { searchText } = this.state
    if (searchText) {
      this.handleSearchChange(searchText)
    }
  }

  componentWillReceiveProps (nextProps) {
    const currentSearchParam = this.getSearchFromURL(this.props)
    const nextSearchParam = this.getSearchFromURL(nextProps)
    const nextLocationState = nextProps.location.state

    if (
      currentSearchParam !== nextSearchParam &&
      (!nextLocationState || !nextLocationState.searching)
    ) {
      this.handleSearchChange(nextSearchParam)
    }
  }

  handleSearchChange (value) {
    const { history } = this.props

    value = value || ''

    this.setState({ searchText: value })

    if (value !== '') {
      this.setState({ searchLoading: true })
      history.replace({ search: '?q=' + value, state: { searching: true } })
      search
        .simpleQuery(value)
        .then(({ nodes, params }) => {
          if (this.state.searchText === params.query) {
            this.setState({ nodes, searchLoading: false })
          }
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err)
        })
    } else {
      this.setState({ nodes: null })
      history.replace({ search: null })
    }
  }

  render () {
    const { searchLoading, searchText, nodes, answeredOnly } = this.state
    const { loading, error, allZNodes } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    let list = nodes || allZNodes

    if (answeredOnly) {
      list = list.filter(node => !!node.answer)
    }

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
        <div style={{ textAlign: 'center' }}>
          <p className="indication">
            Nothing found &nbsp;<i className="material-icons">sms_failed</i>
          </p>
          <br />
          <br />
          <Link to={{ pathname: '/q/new', state: { question: searchText } }}>
            <Button
              icon="record_voice_over"
              label="Ask the question !"
              accent
              raised
            />
          </Link>
        </div>
      )
    } else {
      Results = (
        <div>
          <p className="indication">
            <Pluralize singular="result" count={list.length} /> found
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
            loading={searchLoading}
            checked={answeredOnly}
            onToggleCheck={() => this.setState({ answeredOnly: !answeredOnly })}
          />
        )}
        <div>{Results}</div>
        {flags.question.new && (
          <Link to="/q/new">
            <TooltipButton
              icon="record_voice_over"
              tooltip="Ask a new question"
              floating
              accent
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
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default graphql(getAllNodes)(Home)
