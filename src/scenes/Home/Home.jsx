import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

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
      searchText: this.getSearchFromURL(props) || '',
      searchLoading: false,
      filters: { answered: true, unanswered: true },
      nodes: null
    }
  }

  getSearchFromURL (props) {
    const q = routing.getQueryParam(props.location, 'q')
    return q ? q.replace(/\+/g, ' ') : null
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

  handleSearchChange = value => {
    const { history } = this.props

    value = value || ''

    this.setState({ searchText: value })

    if (value !== '') {
      this.setState({ searchLoading: true })
      history.replace({
        search: '?q=' + value.replace(/\s/g, '+'),
        state: { searching: true }
      })
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

    // Filters
    list = list.filter(node => {
      const isAnswered = !!node.answer
      return isAnswered ? filters.answered : filters.unanswered
    })

    let Results

    if (searchText === '' && list.length > 0) {
      Results = (
        <ResultList
          nodes={list}
          indication="Latest questions"
          collapsed={true}
        />
      )
    } else if (list.length === 0) {
      Results = <NoResults prefill={searchText} />
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
          onToggleCheck={filters =>
            this.setState({
              filters: filters
            })
          }
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
