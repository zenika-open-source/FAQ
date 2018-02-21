import emoji from 'emoji-dictionary'

export default text => {
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
