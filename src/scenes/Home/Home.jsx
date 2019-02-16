import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import debounce from 'lodash/debounce'

import { UserContext } from 'contexts'

import { Loading, Button } from 'components'

import { unserialize, addToQueryString } from 'helpers'

import { Searchbar, ResultList } from './components'

class Home extends Component {
  static contextType = UserContext

  constructor(props) {
    super(props)

    const params = unserialize(props.location.search)

    this.state = {
      searchText: params.q,
      debouncedSearchText: params.q,
      searchLoading: false,
      tags: params.tags
    }
  }

  onSearchChange = text => {
    const { history, location } = this.props

    this.setState({ searchText: text })

    addToQueryString(history, location, {
      q: text
    })

    this.querySearchProvider()
  }

  querySearchProvider = debounce(
    () => this.setState(state => ({ debouncedSearchText: state.searchText })),
    200
  )

  setSearchLoading = loading => this.setState({ searchLoading: loading })

  onTagsChange = tags => {
    const { history, location } = this.props

    this.setState({ tags })

    addToQueryString(history, location, { tags })
  }

  render() {
    if (!this.context) return <Loading />

    return (
      <div>
        <Searchbar
          text={this.state.searchText}
          tags={this.state.tags}
          loading={this.state.searchLoading}
          onTextChange={this.onSearchChange}
          onTagsChange={this.onTagsChange}
        />
        <ResultList
          searchText={this.state.debouncedSearchText}
          setSearchLoading={this.setSearchLoading}
          group={this.context.currentGroup}
        />
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
  location: PropTypes.object,
  history: PropTypes.object
}

export default Home
