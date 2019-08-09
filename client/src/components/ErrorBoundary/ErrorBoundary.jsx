import React from 'react'

import { useIntl } from 'services'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    const intl = useIntl(ErrorBoundary)

    if (this.state.hasError) {
      return <h1 style={{ textAlign: 'center', marginTop: '3rem' }}>{intl('message')}</h1>
    }

    return this.props.children
  }
}

ErrorBoundary.translations = {
  en: { message: 'Something went wrong.' },
  fr: { message: "Quelque chose s'est mal passé." }
}

export default ErrorBoundary
