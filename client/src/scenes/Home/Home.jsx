import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import debounce from 'lodash/debounce'

import { Button } from 'components'

import { useIntl } from 'services'
import { unserialize, addToQueryString } from 'helpers'

import { Searchbar, ResultList } from './components'

class Home extends Component {
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

    const labels = tags.map(tag => tag.name)

    this.setState({ tags: labels })

    addToQueryString(history, location, { tags: labels })
  }

  render() {
    const intl = useIntl(Home)

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
        />
        <Link to="/q/new">
          <Button
            icon="record_voice_over"
            data-tooltip={intl('new_question')}
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

Home.translations = {
  en: { new_question: 'New question' },
  fr: { new_question: 'Nouvelle question' }
}

export default Home
