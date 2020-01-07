import React, { useRef, useState, useEffect } from 'react'

import './Carousel.scss'

const Carousel = ({ count, children }) => {
  const ref = useRef()
  const [width, setWidth] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const onResize = () => {
      if (ref.current) {
        setWidth(ref.current.clientWidth)
      }
    }

    onResize()

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ref, count])

  return (
    <div className="own-carousel" ref={ref} style={{ '--carousel-width': width + 'px' }}>
      <div className="own-prev" onClick={() => setCurrent(cur => (cur || count) - 1)}>
        <i className="fas fa-angle-left" />
      </div>
      <div
        className="own-carousel-stage"
        style={{ transform: `translate3d(-${current * width}px, 0px, 0px)` }}
      >
        {children}
      </div>
      <div className="own-next" onClick={() => setCurrent(cur => (cur + 1) % count)}>
        <i className="fas fa-angle-right" />
      </div>
    </div>
  )
}

const CarouselItem = ({ children }) => {
  return <div className="single_carousel">{children}</div>
}

Carousel.Item = CarouselItem

export default Carousel
