import { useContext, createContext } from 'react'

import { useClickOutside } from 'helpers'

const ModalContext = createContext()

const Modal = ({ active, setActive, loading, children }) => {
  const closeModal = () => {
    if (!loading) {
      setActive(false)
    }
  }

  const ref = useClickOutside(closeModal)

  return (
    <ModalContext.Provider value={closeModal}>
      <div
        className={`fixed top-0 left-0 w-screen h-screen z-10 items-center justify-center ${
          active ? 'flex' : 'hidden'
        }`}
      >
        <div className="absolute w-full h-full bg-secondary-font-dark opacity-40 z-0" />
        <div
          className="relative bg-primary-font max-w-md rounded-sm border border-secondary-font-light shadow-[0_0_18_rgb(0,0,0,0.4)]"
          ref={ref}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )
}

const Title = ({ children }) => {
  const closeModal = useContext(ModalContext)
  return (
    <div className="p-4 relative border-b border-b-[#d1d5da] bg-[#f6f8fa] rounded-t [&_h2]:text-[16px] [&_h2]:text-secondary-font-dark">
      {children}
      <span
        className="absolute right-0 top-0 px-4 py-3 text-[22px] cursor-pointer text-secondary-font-light hover:text-primary after:content-['×']"
        onClick={closeModal}
      />
    </div>
  )
}

const Text = ({ children }) => (
  <div className="p-4 [&_p]:mb-3 [&_p]:mt-0 [&_p]:text-secondary-font-dark [&_p]:text-justify [&_p]:leading-normal">
    {children}
  </div>
)

const Alert = ({ children }) => (
  <div className="p-4 bg-[#fffbdd] text-[#735c0f] border-y border-y-[rgb(27,31,35,0.15)] -mt-px">
    {children}
  </div>
)

Modal.Title = Title
Modal.Text = Text
Modal.Alert = Alert

export default Modal
