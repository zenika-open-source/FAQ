import React from 'react'

import { useIntl } from 'services'
import TipsComponent from 'components/Tips'

const Tips = props => {
  const intl = useIntl(Tips)

  return (
    <TipsComponent {...props} uid="tips_answer">
      <h3>{intl('title')}</h3>
      <div style={{ textAlign: 'center' }}>
        <ul style={{ textAlign: 'left' }}>
          {intl('tips').map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </TipsComponent>
  )
}

Tips.translations = {
  en: {
    title: 'Tips to write great answers on the FAQ',
    tips: [
      'A partial answer is better than no answer.',
      'Be precise and factual.',
      'The best answers are pleasant to read and well formatted.',
      'Stay impersonal, an answer is neither a discussion nor a report.',
      'FAQ is meant to feel like an encyclopedia more than a forum. You may leave out politeness formulas.',
      'Specify the sources of your information (Internal wiki, Workplace or others).',
      'Mention similar questions to complete your answer.'
    ]
  },
  fr: {
    title: 'Conseils pour écrire de super réponses sur la FAQ',
    tips: [
      'Une réponse partielle vaut mieux que pas de réponse.',
      'Soyez précis et factuel.',
      'Les meilleures réponses sont agréables à lire et bien formatées.',
      "Restez impersonnel, une réponse n'est ni une discussion ni un rapport.",
      "FAQ est conçu pour ressembler à une encyclopédie plutôt qu'à un forum. Vous pouvez omettre les formules de politesse.",
      'Précisez les sources de vos informations (wiki interne, Workplace ou autres).',
      'Mentionnez des questions similaires pour compléter votre réponse.'
    ]
  }
}

export default Tips
