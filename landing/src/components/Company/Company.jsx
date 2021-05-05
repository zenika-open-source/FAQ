import React from 'react'

const Company = () => (
  <div id="about_us" className="compapy_info">
    <div className="container">
      <div className="row">
        <div className="col-xl-5 col-md-5">
          <div className="man_thumb">
            <img src="img/ilstrator/man.png" alt="" />
          </div>
        </div>
        <div className="col-xl-7 col-md-7">
          <div className="company_info">
            <h3>
              FAQ is built by Zenika,
              <br />a company led by passion.
            </h3>
            <p>
              Zenika is led by passion, committed to creating an environment where competence
              mirrors creativity with outstanding employees. We are specialized in software
              architecture and Agile methods with a threefold-expertise in consulting, realization
              and training.
            </p>

            <a
              href="https://zenika.com"
              target="_blank"
              rel="noopener noreferrer"
              className="boxed-btn3"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Company
