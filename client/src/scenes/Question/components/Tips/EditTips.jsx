import React from 'react'

import { useIntl } from 'services'

import TipsComponent from 'components/Tips'

const Tips = props => {
  const intl = useIntl(Tips)

  return (
    <TipsComponent {...props} uid="tips_question">
      <h3>{intl('title')}</h3>
      <div style={{ textAlign: 'center' }}>
        <ul style={{ textAlign: 'left' }}>
          {intl('tips').map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
      <div className="row-on-mobile">
        <div>
          <h3>
            <i className="material-icons" style={{ color: 'green' }}>
              check
            </i>
            {intl('good.title')}
          </h3>
          <ul>
            {intl('good.examples').map((example, i) => (
              <li key={i}>{example}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>
            <i className="material-icons" style={{ color: 'red' }}>
              close
            </i>
            {intl('bad.title')}
          </h3>
          <table className="misplaced-questions">
            <tbody>
              {intl('bad.examples').map(([type, example], i) => (
                <tr key={i}>
                  <td>▸</td>
                  <td>
                    <b>{type}</b>
                  </td>
                  <td>{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TipsComponent>
  )
}

Tips.translations = {
  en: {
    title: 'Tips to write great questions on the FAQ',
    tips: [
      "Search the FAQ before you add your question to make sure it doesn't already exist.",
      "You don't have to strike for the perfect wording. Others can improve it.",
      <span>
        Privilege questions responding to the <b>"how"</b> rather than the <b>"why"</b>.
      </span>,
      'Stay objective and factual.'
    ],
    good: {
      title: 'Great questions',
      examples: [
        'Where can I get the ElasticSearch training material?',
        'How can I use Alibeez API?',
        'How to reach the Nantes office from the train station?',
        "What's the difference between pay with and without variable?"
      ]
    },
    bad: {
      title: 'Misplaced questions',
      examples: [
        ['Technical:', 'What are the differences between mocks and stubs?'],
        ['Debating:', "Shouldn't we change the collective agreement?"],
        ['Open:', 'What are the best books to read for an architect?'],
        ['Temporal:', "What are the 2018 figures for the Nantes' office?"],
        ['Vague:', 'How does recruitment work?']
      ]
    }
  },
  fr: {
    title: 'Conseils pour écrire de super questions sur la FAQ',
    tips: [
      "Cherchez la FAQ avant d'ajouter votre question pour vous assurer que celle-ci n'existe pas déjà.",
      "Vous n'avez pas besoin de trouver la formulation parfaite. D'autres pourront l'améliorer.",
      <span>
        Privilégiez les question qui répondent au <b>comment</b> plutôt qu'au <b>pourquoi</b>.
      </span>,
      'Restez objectif et factuel.'
    ],
    good: {
      title: 'Super questions',
      examples: [
        'Où puis-je trouver le matériel de formation ElasticSearch&nbsp;?',
        "Comment utiliser l'API Alibeez&nbsp;?",
        "Comment rejoindre l'agence de Nantes depuis la gare&nbsp;?",
        'Quelle est la différence entre un salaire avec et sans variable&nbsp;?'
      ]
    },
    bad: {
      title: 'Questions mal placées',
      examples: [
        ['Technique:', 'Quelles sont les différences entre les mocks et les stubs&nbsp;?'],
        ['Polémique:', 'Ne devrions-nous pas changer notre convention collective&nbsp;?'],
        ['Ouverte:', 'Quels sont les livres à lire quand on est architecte logiciel&nbsp;?'],
        ['Temporelle:', "Quels sont les résultats 2018 de l'agence nantaise&nbsp;?"],
        ['Vague:', 'Comment fonctionne le recrutement&nbsp;?']
      ]
    }
  }
}

export default Tips
