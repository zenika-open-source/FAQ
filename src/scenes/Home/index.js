import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { getAllNodes } from './queries'

import { flags, routing, search } from 'services'

import Button from 'react-toolbox/lib/button/Button'
import Tooltip from 'react-toolbox/lib/tooltip/Tooltip'

import Loading from 'components/Loading'

import Searchbar from './components/Searchbar'
import NoResults from './components/NoResults'
import ResultList from './components/ResultList'

import './style.css'

const TooltipButton = Tooltip()(Button)

class Home extends Component {
  constructor (props) {
    super(props)

    const searchText = this.getSearchFromURL(props)

    this.state = {
      searchText: searchText || '',
      searchLoading: false,
      filters: { answeredOnly: false },
      nodes: null
    }
  }

  getSearchFromURL (props) {
    return routing.getQueryParam(props.location, 'q')
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
    const { searchLoading, searchText, nodes, filters } = this.state
    const { loading, error, allZNodes } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    let list = nodes || allZNodes

    if (filters.answeredOnly) {
      list = list.filter(node => !!node.answer)
    }

    let Results

    if (searchText === '') {
      Results = <ResultList nodes={list} indication="Latest questions" />
    } else if (list.length === 0) {
      Results = <NoResults prefill={searchText} />
    } else {
      Results = <ResultList nodes={list} />
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
            checked={filters.answeredOnly}
            onToggleCheck={() =>
              this.setState({
                filters: { answeredOnly: !filters.answeredOnly }
              })
            }
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

export default getAllNodes(Home)
