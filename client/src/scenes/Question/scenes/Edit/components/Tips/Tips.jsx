import { getIntl } from 'services'

import TipsComponent from 'components/Tips'

const Tips = (props) => {
  const intl = getIntl(Tips)

  return (
    <TipsComponent {...props} uid="tips_question">
      <h3 className="text-primary flex items-center justify-center">{intl('title')}</h3>
      <div className="text-center">
        <ul className="list-none p-0 mx-auto my-4 inline-block text-left">
          {intl('tips').map((tip, i) => (
            <li
              className="py-[0.1rem] flex items-center leading-5 before:pr-[5px] before:content-['▸'] before:text-primary"
              key={i}
            >
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex max-[{480px}]:flex-col">
        <div>
          <h3 className="text-primary flex items-center justify-center">
            <i className="material-icons" style={{ color: 'green' }}>
              check
            </i>
            {intl('good.title')}
          </h3>
          <ul className="list-none p-0 mx-auto inline-block text-left">
            {intl('good.examples').map((example, i) => (
              <li
                className="py-[0.1rem] flex items-center leading-5 before:pr-[5px] before:content-['▸'] before:text-primary"
                key={i}
              >
                {example}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-primary flex items-center justify-center">
            <i className="material-icons" style={{ color: 'red' }}>
              close
            </i>
            {intl('bad.title')}
          </h3>
          <table className="border-spacing-0 mt-4 leading-5">
            <tbody>
              {intl('bad.examples').map(([type, example], i) => (
                <tr className="my-[0.1rem]" key={i}>
                  <td className="text-primary ">▸</td>
                  <td className="pr-2">
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
      // eslint-disable-next-line react/jsx-key
      <span>
        Privilege questions responding to the <b>"how"</b> rather than the <b>"why"</b>.
      </span>,
      'Stay objective and factual.',
    ],
    good: {
      title: 'Great questions',
      examples: [
        'Where can I get the ElasticSearch training material?',
        'How can I use Alibeez API?',
        'How to reach the Nantes office from the train station?',
        "What's the difference between pay with and without variable?",
      ],
    },
    bad: {
      title: 'Misplaced questions',
      examples: [
        ['Technical:', 'What are the differences between mocks and stubs?'],
        ['Debating:', "Shouldn't we change the collective agreement?"],
        ['Open:', 'What are the best books to read for an architect?'],
        ['Temporal:', "What are the 2018 figures for the Nantes' office?"],
        ['Vague:', 'How does recruitment work?'],
      ],
    },
  },
  fr: {
    title: 'Conseils pour écrire de super questions sur la FAQ',
    tips: [
      "Cherchez la FAQ avant d'ajouter votre question pour vous assurer que celle-ci n'existe pas déjà.",
      "Vous n'avez pas besoin de trouver la formulation parfaite. D'autres pourront l'améliorer.",
      // eslint-disable-next-line react/jsx-key
      <span>
        Privilégiez les question qui répondent au <b>comment</b> plutôt qu'au <b>pourquoi</b>.
      </span>,
      'Restez objectif et factuel.',
    ],
    good: {
      title: 'Super questions',
      examples: [
        'Où puis-je trouver le matériel de formation ElasticSearch ?',
        "Comment utiliser l'API Alibeez ?",
        "Comment rejoindre l'agence de Nantes depuis la gare ?",
        'Quelle est la différence entre un salaire avec et sans variable ?',
      ],
    },
    bad: {
      title: 'Questions mal placées',
      examples: [
        ['Technique:', 'Quelles sont les différences entre les mocks et les stubs ?'],
        ['Polémique:', 'Ne devrions-nous pas changer notre convention collective ?'],
        ['Ouverte:', 'Quels sont les livres à lire quand on est architecte logiciel ?'],
        ['Temporelle:', "Quels sont les résultats 2018 de l'agence nantaise ?"],
        ['Vague:', 'Comment fonctionne le recrutement ?'],
      ],
    },
  },
}

export default Tips
