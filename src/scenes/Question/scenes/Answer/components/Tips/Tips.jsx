import React from 'react'

import TipsComponent from 'components/Tips'

const Tips = props => (
  <TipsComponent {...props} uid="tips_answer">
    <h3>Tips to write great answers on the FAQ</h3>
    <div style={{ textAlign: 'center' }}>
      <ul style={{ textAlign: 'left' }}>
        <li>A partial answer is better than no answer.</li>
        <li>Be precise and factual.</li>
        <li>The best answers are pleasant to read and well formatted.</li>
        <li>
          Stay impersonal, an answer is neither a discussion nor a report.
        </li>
        <li>
          FAQ is meant to feel like an encyclopedia more than a forum. You may
          leave out politeness formulas.
        </li>
        <li>
          Specify the sources of your information (Zentranet, Workplace or
          others)
        </li>
        <li>Mention similar questions to complete your answer.</li>
      </ul>
    </div>
  </TipsComponent>
)

export default Tips
