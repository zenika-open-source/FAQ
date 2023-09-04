import PropTypes from 'prop-types'

import { getIntl } from 'services'

import './Loading.css'

const Loading = ({ text }) => {
  const intl = getIntl(Loading)

  return (
    <div className="text-center mt-12">
      <div className="relative my-0 mx-auto w-24 h-24 before:content-[''] before:block before:pt-[100%] origin-center">
        <svg className="h-full w-full absolute inset-0 m-auto animate-spin" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
      <p>
        <b>{text || intl('loading')}</b>
      </p>
    </div>
  )
}

Loading.propTypes = {
  text: PropTypes.string,
}

Loading.translations = {
  en: { loading: 'Loading...' },
  fr: { loading: 'Chargement...' },
}

export default Loading
