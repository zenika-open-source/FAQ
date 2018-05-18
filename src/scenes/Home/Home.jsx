import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import debounce from 'lodash/debounce'

import { getAllNodes } from './queries'

import { routing, search } from 'services'

import Loading from 'components/Loading'
import Button from 'components/Button'

import Searchbar from './components/Searchbar'
import NoResults from './components/NoResults'
import ResultList from './components/ResultList'

class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: '',
      nextSearchText: '',
      searchLoading: false,
      filters: { answered: true, unanswered: true },
      searchTags: [],
      nextSearchTags: [],
      nodes: null
    }
  }

  static getSearchFromURL (props) {
    const q = routing.getQueryParam(props.location, 'q')
    const tags = routing.getQueryParam(props.location, 'tags')
    return {
      q: q ? q.replace(/\+/g, ' ') : '',
      tags: tags
        ? tags
          .replace(/tag:/g, '')
          .split(' ')
          .map(t => t.replace(/-/g, ' '))
        : []
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { searchText, searchTags } = prevState
    const nextSearch = Home.getSearchFromURL(nextProps)

    const nextState = {}

    if (searchText !== nextSearch.q) {
      nextState.nextSearchText = nextSearch.q
    }

    if (searchTags.length !== nextSearch.tags.length) {
      nextState.nextSearchTags = nextSearch.tags
    }

    return nextState || null
  }

  componentDidUpdate () {
    const { nextSearchText, nextSearchTags } = this.state

    if (nextSearchText || nextSearchTags) {
      this.handleSearchChange(nextSearchText, nextSearchTags)
    }
  }

  handleSearchChange = (value, tags) => {
    const { history } = this.props
    const { searchTags } = this.state

    value = value || ''
    tags = tags || searchTags

    this.setState({
      searchText: value,
      searchTags: tags,
      nextSearchText: null,
      nextSearchTags: null
    })

    let urlSearch = []

    if (value !== '' || tags.length > 0) {
      if (value !== '') {
        urlSearch.push('q=' + value.replace(/\s/g, '+'))
      }
      if (tags.length > 0) {
        urlSearch.push('tags=' + tags.join('+').replace(/\s/g, '-'))
      }
      history.replace({ search: '?' + urlSearch.join('&') })
    } else {
      this.setState({ nodes: null })
      history.replace({ search: null })
    }

    this.retrieveResults(value, tags)
  }

  retrieveResults = debounce((value, tags) => {
    if (value !== '' || tags.length > 0) {
      this.setState({ searchLoading: true })
      search
        .simpleQuery(value, tags)
        .then(({ nodes, rawSearchText }) => {
          if (this.state.searchText === rawSearchText) {
            this.setState({ nodes, searchLoading: false })
          }
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err)
        })
    }
  }, 200)

  changeTagList = (action, tag) => {
    const { searchText, searchTags } = this.state
    const index = searchTags.indexOf(tag)
    switch (action) {
    case 'add':
      if (index < 0) {
        searchTags.push(tag)
        this.setState({ searchTags })
        this.handleSearchChange(searchText, searchTags)
      }
      break
    case 'remove':
      if (index > -1) {
        searchTags.splice(index, 1)
        this.setState({ searchTags })
        this.handleSearchChange(searchText, searchTags)
      }
      break
    default:
      break
    }
  }

  render () {
    const { searchLoading, searchText, nodes, filters, searchTags } = this.state
    const { loading, error, allZNodes } = this.props.data

    if (loading) {
      return <Loading />
    }

    if (error) {
      return <div>Error :(</div>
    }

    let list = nodes || allZNodes

    // Filters
    list = list.filter(node => {
      const isAnswered = !!node.answer
      return isAnswered ? filters.answered : filters.unanswered
    })

    let Results

    if (list.length === 0) {
      Results = <NoResults prefill={searchText} />
    } else if (
      searchText === '' &&
      searchTags.length === 0 &&
      list.length > 0
    ) {
      Results = (
        <ResultList
          nodes={list}
          indication="Latest questions"
          collapsed={true}
        />
      )
    } else {
      Results = <ResultList nodes={list} collapsed={false} />
    }

    return (
      <div>
        <Searchbar
          text={searchText}
          search={this.handleSearchChange}
          loading={searchLoading}
          filters={filters}
          tags={searchTags}
          onToggleCheck={filters =>
            this.setState({
              filters: filters
            })
          }
          changeTagList={this.changeTagList}
        />
        <div>{Results}</div>
        <Link to="/q/new">
          <Button
            icon="record_voice_over"
            data-tooltip="New question"
            style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
            primary
            round
            raised
            fixed
          />
        </Link>
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
