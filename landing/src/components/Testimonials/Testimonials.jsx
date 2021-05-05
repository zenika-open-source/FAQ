import React from 'react'

import Carousel from './Carousel'

const Testimonials = () => {
  const items = [
    {
      text: (
        <>
          Donec imperdiet congue orci consequat mattis. Donec rutrum porttitor <br />
          sollicitudin. Pellentesque id dolor tempor sapien feugiat ultrices nec sed neque.
          <br />
          Fusce ac mattis nulla. Morbi eget ornare dui.
        </>
      ),
      image: 'img/testmonial/thumb.png',
      name: 'Jane Doe',
      title: 'Business Owner'
    },
    {
      text: (
        <>
          Donec imperdiet congue orci consequat mattis. Donec rutrum porttitor <br />
          sollicitudin. Pellentesque id dolor tempor sapien feugiat ultrices nec sed neque.
          <br />
          Fusce ac mattis nulla. Morbi eget ornare dui.
        </>
      ),
      image: 'img/testmonial/thumb.png',
      name: 'Jane Doe the 2nd',
      title: 'Business Owner'
    },
    {
      text: (
        <>
          Donec imperdiet congue orci consequat mattis. Donec rutrum porttitor <br />
          sollicitudin. Pellentesque id dolor tempor sapien feugiat ultrices nec sed neque.
          <br />
          Fusce ac mattis nulla. Morbi eget ornare dui.
        </>
      ),
      image: 'img/testmonial/thumb.png',
      name: 'Jane Doe the 3rd',
      title: 'Business Owner'
    }
  ]

  return (
    <div className="testimonial_area ">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="testmonial_active">
              <Carousel count={items.length}>
                {items.map((item, i) => (
                  <Carousel.Item key={i}>
                    <div className="single_testmonial text-center">
                      <div className="quote">
                        <img src="img/testmonial/quote.svg" alt="" />
                      </div>
                      <p>{item.text}</p>
                      <div className="testmonial_author">
                        <div className="thumb">
                          <img src={item.image} alt="" />
                        </div>
                        <h3>{item.name}</h3>
                        <span>{item.title}</span>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials
