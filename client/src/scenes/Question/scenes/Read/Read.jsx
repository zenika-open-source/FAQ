import { useMutation } from '@apollo/client'
import { Button, Flags, Tags } from 'components'
import Card, { CardText, CardTitle } from 'components/Card'
import Dropdown, { DropdownItem } from 'components/Dropdown'
import { useUser } from 'contexts'
import { getNavigatorLanguage, handleTranslation } from 'helpers'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import NotFound from 'scenes/NotFound'
import { getIntl, markdown } from 'services'

import { ActionMenu } from '../../components'
import { FlagsDropdown, History, LanguageDropdown, Meta, Share, Sources, Views } from './components'
import { CREATE_FLAG, INCREMENT_VIEWS_COUNTER, REMOVE_FLAG } from './queries'

const Read = ({ zNode, loading }) => {
  const params = useParams()
  const navigate = useNavigate()

  const [incremented, setIncremented] = useState(false)

  const [questionTitle, setQuestionTitle] = useState('')
  const [answerContent, setAnswerContent] = useState('')
  const [isTranslated, setIsTranslated] = useState(false)

  const [createFlag] = useMutation(CREATE_FLAG, { refetchQueries: ['getNode'] })
  const [removeFlag] = useMutation(REMOVE_FLAG)
  const [incrementViewsCounter] = useMutation(INCREMENT_VIEWS_COUNTER)

  const user = useUser()

  const originalQuestionLanguage = zNode?.question.language
  const navigatorLanguage = getNavigatorLanguage()

  const translate = (language) => {
    const content = handleTranslation(language, zNode)
    setQuestionTitle(content.question)
    setAnswerContent(content.answer)
    setIsTranslated(content.isTranslation)
  }

  useEffect(() => {
    if (loading || incremented) return
    incrementViewsCounter({ variables: { questionId: zNode.question.id } })
    setIncremented(true)
  }, [incremented, incrementViewsCounter, zNode])

  useEffect(() => {
    if (!loading && zNode && navigatorLanguage) {
      translate(navigatorLanguage)
    }
  }, [zNode, loading])

  const intl = getIntl(Read)

  if (zNode === null) {
    return <NotFound />
  }

  const preventAnswerEdit = () => {
    const certified = zNode?.flags.find((flag) => flag.type === 'certified')
    const isSpecialist = user.specialties.some((specialty) =>
      zNode.tags.some((tag) => specialty.name === tag.label.name),
    )
    if (certified && !isSpecialist) {
      if (window.confirm(intl('alert'))) {
        return navigate(`/q/${params.slug}/answer`)
      }
    } else {
      return navigate(`/q/${params.slug}/answer`)
    }
  }

  /* Redirect to correct URL if old slug used */
  const correctSlug = zNode.question.slug + '-' + zNode.id
  if (params.slug !== correctSlug) {
    return <Navigate to={'/q/' + correctSlug} />
  }

  return (
    <div>
      <Helmet>
        <title>FAQ - {markdown.title(zNode.question.title)}</title>
      </Helmet>
      <ActionMenu backLink="/" backLabel={intl('menu.home')} goBack>
        <FlagsDropdown
          zNode={zNode}
          onSelect={(type) => createFlag({ variables: { type, nodeId: zNode.id } })}
          onRemove={(type) => removeFlag({ variables: { type, nodeId: zNode.id } })}
        />
        <Dropdown button={<Button icon="edit" label={intl('menu.edit.label')} link />}>
          <DropdownItem icon="edit" onClick={() => navigate(`/q/${params.slug}/edit`)}>
            {intl('menu.edit.question')}
          </DropdownItem>
          <DropdownItem icon="question_answer" onClick={preventAnswerEdit}>
            {intl('menu.edit.answer')}
          </DropdownItem>
        </Dropdown>
      </ActionMenu>
      <Card>
        <CardTitle style={{ padding: '1.2rem' }}>
          <div className="grow">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              <h1>{markdown.title(questionTitle)}</h1>
              {isTranslated && (
                <span
                  data-tooltip={intl('auto_translated')}
                  style={{
                    marginLeft: '1rem',
                  }}
                >
                  <i className="material-icons" style={{ fontSize: '1rem' }}>
                    translate
                  </i>
                </span>
              )}
            </div>
            {zNode.tags.length > 0 && <Tags tags={zNode.tags} />}
          </div>
          <Flags node={zNode} withLabels={true} />
          <Views value={zNode.question.views} />
          <Share node={zNode} />
          {zNode.question.language && (
            <LanguageDropdown
              onLanguageChanged={translate}
              originalLanguage={originalQuestionLanguage}
              primary={isTranslated}
              link={!isTranslated}
            />
          )}
        </CardTitle>
        {zNode.answer?.certified && (
          <CardText style={{ border: '2px solid #caac00', marginTop: '0.5rem' }}>
            <p className="small-text centered" style={{ padding: '0.5rem', margin: '0' }}>
              {intl('certified_answer')}
            </p>
            <div style={{ padding: '0.5rem', margin: '0' }}>
              {markdown.html(zNode.answer.certified)}
            </div>
          </CardText>
        )}
        <CardText>
          {zNode.answer ? (
            <>
              {zNode.answer.certified && (
                <p className="small-text centered" style={{ padding: '0.5rem', margin: '0' }}>
                  {intl('recent_answer')}
                </p>
              )}
              <div style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                {markdown.html(answerContent)}
              </div>
              <Sources sources={zNode.answer.sources} />
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                marginTop: '2rem',
                marginBottom: '2rem',
              }}
            >
              <b>{intl('no_answer')}</b>
              <br />
              <br />
              <Link to={`/q/${params.slug}/answer`} className="btn-container">
                <Button icon="question_answer" primary>
                  {intl('answer')}
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

Read.translations = {
  en: {
    menu: {
      home: 'Home',
      edit: {
        label: 'Edit ...',
        question: 'Question',
        answer: 'Answer',
      },
    },
    certified: 'Certified on',
    auto_translated: 'Automatic translation',
    no_answer: 'No answer yet...',
    answer: 'Answer the question',
    certified_answer: 'Certified answer',
    recent_answer: 'Latest answer',
    alert:
      'This answer has been certified by a specialist in this field.\nAre you sure that you want to modify it ?\nThis version will still be kept',
  },
  fr: {
    menu: {
      home: 'Accueil',
      edit: {
        label: 'Modifier ...',
        question: 'Question',
        answer: 'Réponse',
      },
    },
    certified: 'Certifiée le',
    auto_translated: 'Traduction automatique',
    no_answer: 'Pas encore de réponse...',
    answer: 'Répondre à la question',
    certified_answer: 'Réponse certifiée',
    recent_answer: 'Dernière réponse',
    alert:
      'Cette réponse a été certifiée par une personne spécialisée dans le domaine.\nEtes-vous sûr de vouloir la modifier ?\nCelle-ci sera tout de même conservée',
  },
}

export default Read
