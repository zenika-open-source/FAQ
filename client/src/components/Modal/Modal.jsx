import React, { useContext } from 'react'
import cn from 'classnames'

import { useClickOutside } from '@helpers'

import './Modal.scss'

const ModalContext = React.createContext()

const Modal = ({ active, setActive, loading, children }) => {
  const closeModal = () => {
    if (!loading) {
      setActive(false)
    }
  }

  const ref = useClickOutside(closeModal)

  return (
    <ModalContext.Provider value={closeModal}>
      <div className={cn('modal', { active })}>
        <div className="modal-background" />
        <div className="modal-content" ref={ref}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

const Title = ({ children }) => {
  const closeModal = useContext(ModalContext)
  return (
    <div className="modal-title">
      {children}
      <span className="modal-close" onClick={closeModal} />
    </div>
  )
}

const Text = ({ children }) => <div className="modal-text">{children}</div>

const Alert = ({ children }) => <div className="modal-alert">{children}</div>

Modal.Title = Title
Modal.Text = Text
Modal.Alert = Alert

export default Modal
