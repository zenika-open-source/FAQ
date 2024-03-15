import { Converter } from 'showdown'
import XSSFilter from 'showdown-xss-filter'

class Markdown {
  constructor() {
    this.showdown = new Converter({
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true,
      extensions: [XSSFilter],
    })

    this.showdown.setFlavor('github')
  }

  title(title) {
    return title
  }

  text(text) {
    text = this.removeEmTagInLink(text)

    return this.showdown.makeHtml(text)
  }

  html(text) {
    return (
      <div className="mde-preview">
        <div
          className="mde-preview-content mt-0 p-0 border-0 break-words prose"
          dangerouslySetInnerHTML={{
            __html: this.text(text),
          }}
        />
      </div>
    )
  }

  removeEmTagInLink(text) {
    const sanitize = (txt) => txt.replace(/<em>/g, '').replace(/<\/em>/g, '')

    text = text.replace(/(\[.*\]\()?(https?:\/\/\S*)/gim, (link, a, b) => {
      const endOfB = b.split('').reduce(
        (acc, c, i) => {
          if (acc.stack === 0) return acc
          return { i, stack: acc.stack + (c === '(' ? 1 : c === ')' ? -1 : 0) }
        },
        { i: 0, stack: 1 },
      )

      if (a && endOfB.stack === 0) {
        // Means it's a markdown link
        return a + sanitize(b.substr(0, endOfB.i)) + b.substr(endOfB.i)
      }

      return `<a href="${sanitize(link)}" target="_blank" rel="noopener noreferrer">${link}</a>`
    })

    return text
  }
}

const markdown = new Markdown()

export default markdown
