import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import Helmet from 'react-helmet'

import { compose } from 'react-apollo'
import { createFlag, removeFlag } from './queries'

import { markdown } from 'services'

import NotFound from 'scenes/NotFound'

import { Button, Flags, Tags } from 'components'
import Card, { CardTitle, CardText } from 'components/Card'
import Dropdown, { DropdownItem } from 'components/Dropdown'

import ActionMenu from '../../components/ActionMenu'
import FlagsDropdown from './components/FlagsDropdown'
import Sources from './components/Sources'
import Meta from './components/Meta'
import Share from './components/Share'
import History from './components/History'

class Read extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showingOriginalContent: ((props.zNode.answer) ?
        (props.zNode.question.titleTranslations[0].text === props.zNode.question.title && props.zNode.answer.contentTranslations[0].text === props.zNode.answer.content)
        : (props.zNode.question.titleTranslations[0].text === props.zNode.question.title)),
      onlyOriginalContent: ((props.zNode.answer) ?
        (props.zNode.question.titleTranslations[0].text === props.zNode.question.title && props.zNode.answer.contentTranslations[0].text === props.zNode.answer.content)
        : (props.zNode.question.titleTranslations[0].text === props.zNode.question.title))
    }
  }
  render() {
    const { history, match, zNode, createFlag, removeFlag } = this.props
    if (zNode === null) {
      return <NotFound />
    }

    /* Redirect to correct URL if old slug used */
    const correctSlug = zNode.question.slug + '-' + zNode.id
    if (match.params.slug !== correctSlug) {
      return <Redirect to={'/q/' + correctSlug} />
    }

    var titlebis;
    if (!this.state.showingOriginalContent) {
      titlebis = zNode.question.titleTranslations[0].text;
    } else {
      titlebis = zNode.question.title;
    }

    var contentbis;
    if (zNode.answer) {
      if (!this.state.showingOriginalContent) {
        contentbis = zNode.answer.contentTranslations[0].text;
      } else {
        contentbis = zNode.answer.content;
      }
    }

    
    var buttonTranslation;
    buttonTranslation = <Button
      icon="language"
      data-tooltip="Translated by Google Translate"
      round
      disabled
      ></Button>

    var messageTranslationTitle;
    var messageTranslationAnswer
    if (zNode.answer != null && contentbis != zNode.answer.content) {
      if (zNode.question.title != titlebis) {
        messageTranslationTitle = buttonTranslation
        messageTranslationAnswer = buttonTranslation
      }
      else {
        messageTranslationAnswer = buttonTranslation
      }
    } else {
      if (zNode.answer == null || zNode.answer.content == contentbis) {
        if (zNode.question.title != titlebis) {
          messageTranslationTitle = buttonTranslation
        }
      }
    }

    var buttonShowDesignation;
    if (this.state.showingOriginalContent) {
      buttonShowDesignation = "Show the translation"
    } else {
      buttonShowDesignation = "Show the original"
    }

    var buttonShow;
    if (!this.state.onlyOriginalContent) {
        buttonShow = <Button
        icon="cached"
        style={{ "paddingTop": '0.42rem' }}
        onClick={() => this.setState({ showingOriginalContent: !this.state.showingOriginalContent })}>
        {buttonShowDesignation}
      </Button>
    }

    return (
      <div>
        <Helmet>
          <title>FAQ - {markdown.title(titlebis)}</title>
        </Helmet>
        <ActionMenu backLink="/" backLabel="Home" goBack>
          {buttonShow}
          <FlagsDropdown
            flags={zNode.flags}
            onSelect={type => createFlag(type, zNode.id)}
            onRemove={type => removeFlag(type, zNode.id)}
          />
          <Dropdown button={<Button icon="edit" label="Edit ..." link />}>
            <DropdownItem
              icon="edit"
              onClick={() => history.push(`/q/${match.params.slug}/edit`)}
            >
              Question
          </DropdownItem>
            <DropdownItem
              icon="question_answer"
              onClick={() => history.push(`/q/${match.params.slug}/answer`)}
            >
              Answer
          </DropdownItem>
          </Dropdown>
        </ActionMenu>
        <Card>
          <CardTitle style={{ padding: '1.2rem' }}>
            <div className="grow">
              <h1>
              {markdown.title(titlebis)} </h1>
              <div className= "translationMessage"
               style = {{ "textAlign" : 'right'}}>
               {messageTranslationTitle}
               </div>
              {zNode.tags.length > 0 && <Tags tags={zNode.tags} />}
            </div>

            <Flags node={zNode} withLabels={true} />
            <Share node={zNode} />
          </CardTitle>
          <CardText>
            {zNode.answer ? (
              <>
                <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                  {markdown.html(contentbis)}
                  <div className="translationMessage"
                    style={{ "textAlign": 'right' }}>
                    {messageTranslationAnswer}
                  </div>
                </div>
                <Sources sources={zNode.answer.sources} />
              </>
            ) : (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    marginBottom: '2rem'
                  }}
                >
                  <b>No answer yet...</b>
                  <br />
                  <br />
                  <Link
                    to={`/q/${match.params.slug}/answer`}
                    className="btn-container"
                  >
                    <Button icon="question_answer" primary>
                      Answer the question
                    </Button>
                  </Link>
                </div>
              )}

            <hr />
            <Meta node={zNode} />
            <History />
          </CardText>
        </Card>
      </div>
    )
  }
}
  Read.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    zNode: PropTypes.object.isRequired,
    createFlag: PropTypes.func.isRequired,
    removeFlag: PropTypes.func.isRequired
  }

  export default compose(
    createFlag,
    removeFlag
  )(Read)
