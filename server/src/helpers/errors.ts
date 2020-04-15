class FaqError extends Error {
  extensions: { type: string }
  name = 'FaqError'

  constructor(type: string, message: string) {
    super(message)
    this.extensions = { type }
  }
}

export { FaqError }
