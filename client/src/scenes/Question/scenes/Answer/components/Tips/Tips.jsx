import { getIntl } from 'services'
import TipsComponent from 'components/Tips'

const Tips = (props) => {
  const intl = getIntl(Tips)

  return (
    <TipsComponent {...props} uid="tips_answer">
      <h3 className="text-primary flex items-center justify-center">{intl('title')}</h3>
      <div className="text-center">
        <ul className="list-none p-0 mx-auto inline-block text-left">
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
      'Mention similar questions to complete your answer.',
    ],
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
      'Mentionnez des questions similaires pour compléter votre réponse.',
    ],
  },
}

export default Tips
