import React from 'react'
import { Converter } from 'showdown'
import emoji from 'emoji-dictionary'

class Markdown {
  constructor () {
    this.showdown = new Converter({
      openLinksInNewWindow: true
    })

    this.showdown.setFlavor('github')
  }

  title (title) {
    return this.emoji(title)
  }

  html (text) {
    text = this.emoji(text)
    return (
      <div className="mde-preview">
        <div
          className="mde-preview-content"
          dangerouslySetInnerHTML={{
            __html: this.showdown.makeHtml(text)
          }}
        />
      </div>
    )
  }

  emoji (text) {
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
      return text.replace(emoticon, emoticons[emoticon])
    }, text)

    // :emoji: to unicode emojis
    return text.replace(/:\w+:/gi, name => emoji.getUnicode(name))
  }
}

const markdown = new Markdown()

export default markdown
