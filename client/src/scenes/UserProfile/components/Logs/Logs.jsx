import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { getIntl } from 'services'
import { formatHistoryAction, nodeUrl } from 'helpers'

import { Loading } from 'components'
import Card, { CardText } from 'components/Card'
import { DefaultPagination } from 'components/Pagination'

import './Logs.css'

const Logs = ({ logs, loading, pagesCount, pageCurrent, onPageSelected, meta }) => {
  const intl = getIntl(Logs)

  const shouldShowLoading = loading && (meta ? meta.pageCurrent !== pageCurrent : true)

  return (
    <Card>
      <CardText>
        <h2 className="mb-4 font-bold">{intl('title')}</h2>
        <hr />
        {shouldShowLoading && <Loading />}
        {!shouldShowLoading &&
          logs.map((h, index) => {
            const action = formatHistoryAction(h, { relative: false })

            return (
              <div
                className={`flex items-center justify-between w-full ${
                  index === 0 ? '' : 'border-t border-t-secondary-dark'
                }`}
                key={h.id}
              >
                <div className="flex items-center">
                  <div className="p-2">
                    <i className="material-icons">{action.icon}</i>
                  </div>
                  <div className="ml-2">You {action.sentence}.</div>
                </div>
                <div className="flex items-center min-w-[185px] text-right">
                  <i className="ml-auto">{action.date}</i>
                  <Link to={nodeUrl(h.node)}>
                    <i className="material-icons ml-[10px]">arrow_forward</i>
                  </Link>
                </div>
              </div>
            )
          })}
        <DefaultPagination
          nbPages={pagesCount}
          current={pageCurrent}
          onPageSelected={onPageSelected}
        />
      </CardText>
    </Card>
  )
}

Logs.propTypes = {
  logs: PropTypes.array,
  loading: PropTypes.bool,
  pagesCount: PropTypes.number,
  pageCurrent: PropTypes.number,
  onPageSelected: PropTypes.func,
  meta: PropTypes.object,
}

Logs.translations = {
  en: { title: 'Logs' },
  fr: { title: 'Logs' },
}

export default Logs
