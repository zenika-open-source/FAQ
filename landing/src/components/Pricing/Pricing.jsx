import React from 'react'

import './Pricing.scss'

const Pricing = () => (
  <div id="pricing" className="service_area">
    <div id="generic_price_table">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="generic_content clearfix">
              <div className="generic_head_price clearfix">
                <div className="generic_head_content clearfix">
                  <div className="head_bg"></div>
                  <div className="head">
                    <span>Community</span>
                  </div>
                </div>

                <div className="generic_price_tag clearfix">
                  <span className="price">
                    <span className="currency" style={{ fontSize: '40px' }}>
                      FREE
                    </span>
                  </span>
                </div>
              </div>

              <div className="generic_feature_list">
                <ul>
                  <li>
                    <span>Unlimited</span> Questions
                  </li>
                  <li>
                    <span>5</span> Users
                  </li>
                  <li>
                    <span>Basic</span> Integrations
                  </li>
                  <li>
                    <span>Google</span> Authentication
                  </li>
                  <li>
                    <span>Github</span> Support
                  </li>
                </ul>
              </div>

              <div className="generic_price_btn clearfix">
                <a className="" href="mailto:contact@faq.team">
                  Get Started
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="generic_content active clearfix">
              <div className="generic_head_price clearfix">
                <div className="generic_head_content clearfix">
                  <div className="head_bg"></div>
                  <div className="head">
                    <span>Enterprise</span>
                  </div>
                </div>
                <div className="generic_price_tag clearfix">
                  <span className="price">
                    <span className="sign">€</span>
                    <span className="currency">2</span>
                    <span className="cent">.99</span>
                    <span className="month">/USER</span>
                    <span className="month">/MON</span>
                  </span>
                </div>
              </div>

              <div className="generic_feature_list">
                <ul>
                  <li>
                    <span>Unlimited</span> Questions
                  </li>
                  <li>
                    <span>Up to 500</span> Users
                  </li>
                  <li>
                    <span>Premium</span> Integrations
                  </li>
                  <li>
                    <span>Google</span> Authentication
                  </li>
                  <li>
                    <span>Email</span> Support
                  </li>
                </ul>
              </div>

              <div className="generic_price_btn clearfix">
                <a className="" href="mailto:contact@faq.team">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="generic_content clearfix">
              <div className="generic_head_price clearfix">
                <div className="generic_head_content clearfix">
                  <div className="head_bg"></div>
                  <div className="head">
                    <span>Unlimited</span>
                  </div>
                </div>
                <div className="generic_price_tag clearfix">
                  <span className="price">
                    <span className="currency" style={{ fontSize: '35px' }}>
                      Contact Us
                    </span>
                  </span>
                </div>
              </div>

              <div className="generic_feature_list">
                <ul>
                  <li>
                    <span>Unlimited</span> Questions
                  </li>
                  <li>
                    <span>Unlimited</span> Users
                  </li>
                  <li>
                    <span>Premium and Beta</span> Integrations
                  </li>
                  <li>
                    <span>Custom</span> Authentication
                  </li>
                  <li>
                    <span>Phone</span> Support
                  </li>
                </ul>
              </div>

              <div className="generic_price_btn clearfix">
                <a className="" href="mailto:contact@faq.team">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Pricing
