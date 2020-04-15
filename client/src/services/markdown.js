import React from 'react'
import { Converter } from 'showdown'
import XSSFilter from 'showdown-xss-filter'
import emojis from 'emojilib/simplemap.json'

class Markdown {
  constructor() {
    this.showdown = new Converter({
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true,
      extensions: [XSSFilter]
    })

    this.showdown.setFlavor('github')
  }

  title(title) {
    return this.emoji(title)
  }

  text(text) {
    text = this.emoji(text)
    text = this.removeEmTagInLink(text)

    return this.showdown.makeHtml(text)
  }

  html(text) {
    return (
      <div className="mde-preview">
        <div
          className="mde-preview-content"
          style={{
            marginTop: '0',
            padding: '0',
            border: '0',
            wordBreak: 'break-word'
          }}
          dangerouslySetInnerHTML={{
            __html: this.text(text)
          }}
        />
      </div>
    )
  }

  emoji(text) {
    const emoticons = {
      ':)': ':slightly_smiling_face:',
      ':(': ':slightly_frowning_face:',
      ':/': ':confused:',
      ':p': ':stuck_out_tongue:',
      ':P': ':stuck_out_tongue:',
      ':D': ':smiley:',
      ';)': ':wink:'
    }

    // Ascii emoticons to :emoji:
    text = Object.keys(emoticons).reduce((text, emoticon) => {
      return text.split(emoticon + ' ').join(emoticons[emoticon] + ' ')
    }, text)

    // :emoji: to unicode emojis
    return text.replace(/:(\w+):/gi, (str, name) => emojis[name] || str)
  }

  removeEmTagInLink(text) {
    const sanitize = txt => txt.replace(/<em>/g, '').replace(/<\/em>/g, '')

    text = text.replace(/(\[.*\]\()?(https?:\/\/\S*)/gim, (link, a, b) => {
      const endOfB = b.split('').reduce(
        (acc, c, i) => {
          if (acc.stack === 0) return acc
          return { i, stack: acc.stack + (c === '(' ? 1 : c === ')' ? -1 : 0) }
        },
        { i: 0, stack: 1 }
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

export const markdown = new Markdown()
