import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { gql, useLazyQuery } from '@apollo/client'

import { useIntl } from 'services'
import { Loading, DefaultPagination } from 'components'

import HistoryAction from './HistoryAction'

import './History.scss'

const ENTRIES_PER_PAGE = 10

const History = ({ node }) => {
  const intl = useIntl(History)
  const [opened, setOpened] = useState(false)
  const [page, setPage] = useState(1)
  const [pagesCount, setPagesCount] = useState(1)

  const [history, { loading, data }] = useLazyQuery(
    gql`
      query($nodeId: String!, $first: Int!, $skip: Int!) {
        history(nodeId: $nodeId, first: $first, skip: $skip) {
          historyActions {
            id
            action
            model
            meta
            createdAt
            user {
              id
              name
              picture
            }
            node {
              id
            }
          }
          meta {
            pagesCount
            pageCurrent
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only'
    }
  )

  useEffect(() => {
    if (opened) {
      history({
        variables: {
          nodeId: node.id,
          first: ENTRIES_PER_PAGE,
          skip: (page - 1) * ENTRIES_PER_PAGE
        }
      })
    }
  }, [opened, history, node.id, page])

  useEffect(() => {
    if (data) {
      setPagesCount(data.history.meta.pagesCount)
    }
  }, [data])

  return (
    <div className="history">
      <div className={cn('toggler', opened ? 'up' : 'down')} onClick={() => setOpened(o => !o)}>
        <span>{intl('title')}</span>
        <div className="arrow" />
      </div>
      {opened && (
        <div className="history-actions">
          {loading || !data ? (
            <Loading text=" " delay={0} />
          ) : (
            data.history.historyActions.map(action => (
              <HistoryAction key={action.id} action={action} />
            ))
          )}
          <DefaultPagination nbPages={pagesCount} current={page} onPageSelected={setPage} />
        </div>
      )}
    </div>
  )
}

History.translations = {
  en: { title: 'history' },
  fr: { title: 'historique' }
}

export default History
