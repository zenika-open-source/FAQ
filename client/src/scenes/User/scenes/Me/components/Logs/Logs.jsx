import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLazyQuery, gql } from '@apollo/client'

import { useIntl, useUser } from 'services'
import { Card, Loading, DefaultPagination } from 'components'
import { formatHistoryAction } from 'helpers'

import './Logs.scss'

const ENTRIES_PER_PAGE = 15

const Logs = () => {
  const intl = useIntl(Logs)
  const user = useUser()

  const [page, setPage] = useState(1)
  const [pagesCount, setPagesCount] = useState(1)

  const [history, { data }] = useLazyQuery(
    gql`
      query($userId: String!, $first: Int!, $skip: Int!) {
        history(userId: $userId, first: $first, skip: $skip) {
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
              question {
                id
                title
                slug
              }
            }
          }
          meta {
            pagesCount
            pageCurrent
          }
        }
      }
    `
  )

  useEffect(() => {
    if (user) {
      history({
        variables: {
          userId: user.id,
          first: ENTRIES_PER_PAGE,
          skip: (page - 1) * ENTRIES_PER_PAGE
        }
      })
    }
  }, [history, user, page])

  useEffect(() => {
    if (data) {
      setPagesCount(data.history.meta.pagesCount)
    }
  }, [data])

  return (
    <Card>
      <Card.Text className="logs">
        <h2>{intl('title')}</h2>
        <hr />
        <br />
        {!data ? (
          <Loading />
        ) : (
          data.history.historyActions.map(h => {
            const action = formatHistoryAction(h, { relative: false })

            return (
              <div className="action" key={h.id}>
                <div className="left">
                  <div style={{ padding: '0.5rem' }}>
                    <i className="material-icons">{action.icon}</i>
                  </div>
                  <div style={{ marginLeft: '0.5rem' }}>You {action.sentence}.</div>
                </div>
                <div className="right">
                  <i style={{ marginLeft: 'auto' }}>{action.date}</i>
                  <Link to={`/q/${h.node.slug}-${h.node.id}`}>
                    <i className="material-icons" style={{ marginLeft: '10px' }}>
                      arrow_forward
                    </i>
                  </Link>
                </div>
              </div>
            )
          })
        )}
        <br />
        <DefaultPagination nbPages={pagesCount} current={page} onPageSelected={setPage} />
      </Card.Text>
    </Card>
  )
}

Logs.translations = {
  en: { title: 'Logs' },
  fr: { title: 'Logs' }
}

export default Logs
