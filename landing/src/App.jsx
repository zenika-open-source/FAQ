import React from 'react'

import {
  Header,
  Slider,
  Features,
  Users,
  Pricing,
  Company,
  Testimonials,
  Footer
} from './components'

import './custom-bootstrap.scss'

function App() {
  return (
    <>
      <Header />
      <Slider />
      <Features />
      <Users />
      <Pricing />
      <Company />
      <Testimonials />
      <Footer />
    </>
  )
}

export default App
