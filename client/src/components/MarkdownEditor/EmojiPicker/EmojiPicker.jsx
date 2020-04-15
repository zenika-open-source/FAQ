import React, { useState, useRef } from 'react'
import { Picker } from 'emoji-mart'

import { useClickOutside } from 'helpers'
import { useIntl } from 'services'

import 'emoji-mart/css/emoji-mart.css'
import './EmojiPicker.scss'

const EmojiPicker = () => {
  const intl = useIntl(EmojiPicker)
  const [opened, setOpened] = useState(false)
  const buttonRef = useRef(null)

  const pickerRef = useClickOutside(evt => {
    if (buttonRef.current && !buttonRef.current.contains(evt.target)) {
      setOpened(false)
    }
  })

  return (
    <div className="emoji-picker-wrapper">
      <span
        ref={buttonRef}
        onClick={() => setOpened(op => !op)}
        aria-label={intl('insert')}
        role="img"
      >
        😀
      </span>
      {opened && (
        <div className="emoji-picker">
          <div ref={pickerRef}>
            <Picker
              native={true}
              title=""
              emoji="point_up"
              onSelect={selected => {
                setOpened(false)
                document.querySelector('textarea.mde-text').next_emoji = selected.native
              }}
              i18n={intl('i18n')}
            />
          </div>
        </div>
      )}
    </div>
  )
}

EmojiPicker.translations = {
  en: {
    insert: 'Insert an emoji',
    i18n: {
      search: 'Search',
      clear: 'Clear',
      notfound: 'No Emoji Found',
      skintext: 'Choose your default skin tone',
      categories: {
        search: 'Search Results',
        recent: 'Frequently Used',
        people: 'Smileys & People',
        nature: 'Animals & Nature',
        foods: 'Food & Drink',
        activity: 'Activity',
        places: 'Travel & Places',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        custom: 'Custom'
      },
      categorieslabel: 'Emoji categories',
      skintones: {
        1: 'Default Skin Tone',
        2: 'Light Skin Tone',
        3: 'Medium-Light Skin Tone',
        4: 'Medium Skin Tone',
        5: 'Medium-Dark Skin Tone',
        6: 'Dark Skin Tone'
      }
    }
  },
  fr: {
    insert: 'Insert an emoji',
    i18n: {
      search: 'Recherche',
      clear: 'Effacer',
      notfound: "Pas d'Emojis trouvés",
      skintext: 'Choisissez votre teint par défaut',
      categories: {
        search: 'Résultats de la recherche',
        recent: 'Utilisés fréquemment',
        people: 'Smileys & Personnes',
        nature: 'Animaux & Nature',
        foods: 'Nourriture & Boisson',
        activity: 'Activité',
        places: 'Voyages & Lieux',
        objects: 'Objets',
        symbols: 'Symboles',
        flags: 'Drapeaux',
        custom: 'Custom'
      },
      categorieslabel: "Categories d'Emojis",
      skintones: {
        1: 'Teint par défaut',
        2: 'Teint clair',
        3: 'Teint clair-moyen',
        4: 'Teint moyen',
        5: 'Teint sombre-moyen',
        6: 'Teint sombre'
      }
    }
  }
}

const emojiPickerCommand = {
  name: 'emoji',
  buttonComponentClass: 'div',
  icon: () => <EmojiPicker />,
  execute: (state0, api) => {
    if (api.textArea.next_emoji) {
      api.setSelectionRange({ start: state0.selection.end, end: state0.selection.end })
      api.replaceSelection(api.textArea.next_emoji)
      api.textArea.next_emoji = undefined
    }
  }
}

export default EmojiPicker
export { emojiPickerCommand }
