import React from 'react'

import { default as TipsComponent } from 'components/Tips'

const Tips = props => (
  <TipsComponent {...props} uid="tips_answer">
    <h3>Tips to write great answers on the FAQ</h3>
    <div style={{ textAlign: 'center' }}>
      <ul style={{ textAlign: 'left' }}>
        <li>A partial answer is better than no answer.</li>
        <li>Be precise and factual.</li>
        <li>
          A satisfactory answer must also be pleasant to read, formate it!
        </li>
        <li>
          Stay impersonal, an answer is neither a discussion nor a report.
        </li>
        <li>The polite formulas are superfluous.</li>
        <li>
          Specify the sources of your information (Zentranet, Workplace or
          other)
        </li>
        <li>Remember to mention similar questions to complete your answer.</li>
      </ul>
    </div>
  </TipsComponent>
)

export default Tips
