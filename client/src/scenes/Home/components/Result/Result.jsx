import PropTypes from 'prop-types'
import { Component } from 'react'
import { Link } from 'react-router-dom'

import { getIntl, markdown } from 'services'

import Card, { CardText, CardTitle } from 'components/Card'
import Flags from 'components/Flags'
import Tags from 'components/Tags'

import './Result.css'
import { getNavigatorLanguage } from 'helpers'

class Result extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: props.collapsed || false,
    }
  }

  render() {
    const intl = getIntl(Result)

    const { node } = this.props
    const { collapsed } = this.state
    const navigatorLanguage = getNavigatorLanguage()
    const isTranslated = navigatorLanguage !== node.question.language

    const getTitle = () => {
      if (navigatorLanguage === node.question.language) {
        return node.question.title
      } else {
        return node.question.translation.text
      }
    }

    const getAnswer = () => {
      if (navigatorLanguage === node.answer.language) {
        return node.answer.content
      } else {
        return node.answer.translation.text
      }
    }

    return (
      <Card className="result">
        <CardTitle onClick={() => this.setState({ collapsed: !collapsed })}>
          <div className="grow">
            {!node.highlights ? (
              <h1>{markdown.title(getTitle())}</h1>
            ) : (
              <h1
                dangerouslySetInnerHTML={{
                  __html: markdown.title(node.highlights.question),
                }}
              />
            )}
            {node.tags.length > 0 && <Tags tags={node.tags} />}
          </div>
          <Flags node={node} withLabels={false} />
          {isTranslated && (
            <span data-tooltip={intl('auto_translated')} style={{marginLeft: "1rem"}}>
              <i className='material-icons'>translate</i>
            </span>
          )}
          <Link
            to={{
              pathname: `/q/${node.question.slug}-${node.id}`,
              state: { from: 'home' },
            }}
            className="open-card"
          >
            <i className="material-icons">keyboard_arrow_right</i>
          </Link>
        </CardTitle>
        <CardText collapsed={collapsed}>
          {node.answer ? (
            markdown.html(
              node.highlights && node.highlights.answer
                ? node.highlights.answer
                : getAnswer(),
            )
          ) : (
            <p style={{ textAlign: 'center' }}>
              <i>{intl('no_answer')}</i>
            </p>
          )}
        </CardText>
      </Card>
    )
  }
}

Result.propTypes = {
  node: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
}

Result.translations = {
  en: { no_answer: 'No answer yet...', auto_translated: 'Automatic translation', },
  fr: { no_answer: 'Pas encore de réponse...', auto_translated: 'Traduction automatique', },
}

export default Result
