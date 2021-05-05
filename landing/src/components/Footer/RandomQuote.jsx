import React from 'react'

const quotes = [
  {
    text: 'I did then what I knew how to do. \nNow that I know better, I do better.',
    author: 'Maya Angelou'
  },
  {
    text: 'The greatest enemy of knowledge is not ignorance, \nit is the illusion of knowledge.',
    author: 'Daniel J. Boorstin'
  },
  {
    text: 'Write what you know. \nThat should leave you with a lot of free time.',
    author: 'Howard Nemerov'
  },
  {
    text: 'An investment in knowledge always pays the best interest.',
    author: 'Benjamin Franklin'
  },
  {
    text: 'The knowledge of all things is possible',
    author: 'Leonardo da Vinci'
  },
  {
    text: 'All men by nature desire knowledge.',
    author: 'Aristotle'
  }
]

const RandomQuote = () => {
  const rnd = Math.floor(Math.random() * quotes.length)

  const quote = quotes[rnd]

  return (
    <p>
      <i>“{quote.text}”</i> <br />- {quote.author}
    </p>
  )
}

export default RandomQuote
