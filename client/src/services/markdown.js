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

  html(text) {
    text = this.emoji(text)
    text = this.removeEmTagInLink(text)

    return (
      <div className="mde-preview">
        <div
          className="mde-preview-content"
          style={{
            marginTop: '0',
            padding: '0',
            border: '0'
          }}
          dangerouslySetInnerHTML={{
            __html: this.showdown.makeHtml(text)
          }}
        />
      </div>
    )
  }

  emoji(text) {
    let emoticons = {
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
      if (a && b[b.length - 1] === ')') {
        // Means it's a markdown link
        return a + sanitize(b)
      }

      return `<a href="${sanitize(link)}" target="_blank" rel="noopener noreferrer">${link}</a>`
    })

    return text
  }
}

const markdown = new Markdown()

export default markdown
