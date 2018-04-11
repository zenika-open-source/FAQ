import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Loading from 'components/Loading'
import Card, { CardText } from 'components/Card'

import { getAllPersonalData } from './queries'

const UserProfile = props => {
  const { loading, error, User } = props.data

  if (loading) {
    return <Loading />
  }

  if (error || User === null) {
    return <div>Error :(</div>
  }

  const userLog = ['questions', 'answers', 'flags']
    .map(entityType => User[entityType].map(({id, createdAt, node}) => ({
      type: {
        questions: 'Ask',
        answers: 'Answer',
        flags: 'Flag'
      }[entityType],
      id,
      at: createdAt,
      question: {
        link: `/q/${node.question.slug}-${node.id}`,
        title: node.question.title
      }
    })))
    .reduce((all, entities) => all.concat(entities))
    // sort by date
    .sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0)

  return (
    <div>
      <Card>
        <CardText>
          <h1>Profile</h1>
          <p>
            This page displays all your personal data (as defined by the GDPR) processed by FAQ.
            In the future, you will be able to edit, delete and download this data at your convenience.
          </p>
          <h1>Identity</h1>
          <div className="card-form">
            <label htmlFor="name">Name</label>
            <input name="name" className="card-input" value={User.name} readOnly />
            <label htmlFor="givenName">Given name</label>
            <input name="givenName" className="card-input" value={User.givenName} readOnly />
            <label htmlFor="familyName">Family name</label>
            <input name="familyName" className="card-input" value={User.familyName} readOnly />
            <label htmlFor="email">Email address</label>
            <input name="email" className="card-input" value={User.email} readOnly />
            <label htmlFor="picture">Picture link</label>
            <input name="picture" className="card-input" value={User.picture} readOnly />
          </div>
          <h1>Log</h1>
          <table className="card-table">
            <thead>
              <tr>
                <td>Action</td>
                <td>When</td>
                <td>Question</td>
              </tr>
            </thead>
            <tbody>
              {userLog.map(({type, id, at, question}) => (
                <tr key={id}>
                  <td>{type}</td>
                  <td style={{whiteSpace: 'nowrap'}}>{at}</td>
                  <td style={{wordBreak: 'break-word'}}><Link to={question.link}>{question.title}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardText>
      </Card>
    </div>
  )
}

UserProfile.propTypes = {
  history: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
}

export default getAllPersonalData(UserProfile)
