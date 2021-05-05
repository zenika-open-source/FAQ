import React from 'react'

const Slider = () => (
  <>
    <div className="shap_big_2 d-none d-lg-block">
      <img src="img/ilstrator/body_shap_2.png" alt="" />
    </div>
    <div className="slider_area">
      <div className="shap_img_1 d-none d-lg-block">
        <img src="img/ilstrator/body_shap_1.png" alt="" />
      </div>
      <div className="poly_img">
        <img src="img/ilstrator/poly.png" alt="" />
      </div>
      <div id="home" className="single_slider  d-flex align-items-center slider_bg_1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-10 offset-xl-1">
              <div className="slider_text text-center">
                <div className="text">
                  <h3>
                    Don't waste your collaborators <br />
                    internal knowledge. Build upon it!
                  </h3>
                  <div>
                    <a className="boxed-btn3" href="mailto:contact@faq.team">
                      {/*Get Started*/}
                      Request Beta Access
                    </a>
                  </div>
                </div>
                <div className="ilstrator_thumb">
                  <img src="img/ilstrator/illustration.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Slider
