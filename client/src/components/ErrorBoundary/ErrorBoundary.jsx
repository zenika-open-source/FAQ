import { Component } from 'react';
import { getIntl } from 'services';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    const intl = getIntl(ErrorBoundary)

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
