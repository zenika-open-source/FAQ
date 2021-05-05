import React from 'react'

const Features = () => (
  <div id="features" className="features_area">
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          <div className="section_title text-center">
            <h3>
              Use FAQ to build an{' '}
              <span style={{ textDecoration: 'underline', textDecorationThickness: '0.5px' }}>
                Internal Knowledge Base
              </span>{' '}
              <br />
              for your organization
            </h3>
            <p>
              FAQ has a demand-driven approach to how knownledge is shared in your company, <br />
              centralizing questions and answer in a single source of truth.
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_1.svg" alt="" />
            </div>
            <h4>Questions / Answers</h4>
            <p>FAQ uses a mixed approach between a Wiki and Stack Overflow.</p>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_2.svg" alt="" />
            </div>
            <h4>High-Quality Search Results</h4>
            <p>FAQ uses Algolia to allow you the fastest access to what you are looking for.</p>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_3.svg" alt="" />
            </div>
            <h4>Internationalization</h4>
            <p>All your questions and answers are translated in multiple languages.</p>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_6.svg" alt="" />
            </div>
            <h4>Intuitive Editor</h4>
            <p>Use an intuitive Markdown Editor to write rich answers.</p>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_4.svg" alt="" />
            </div>
            <h4>Integrations</h4>
            <p>Connect your FAQ to multiple services: Slack, Workplace, ...</p>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 col-lg-4">
          <div className="single_feature">
            <div className="icon">
              <img src="img/svg_icon/feature_5.svg" alt="" />
            </div>
            <h4>Custom Configuration</h4>
            <p>Configure your FAQ to adapt it to your needs.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Features
