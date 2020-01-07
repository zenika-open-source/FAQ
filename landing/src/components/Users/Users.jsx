import React from 'react'

const users = [{ name: 'Zenika', image: 'img/users/zenika.png' }]

const Users = () => (
  <div id="they_use_faq" className="case_study_area case_bg_1">
    <div className="patrn_1 d-none d-lg-block">
      <img src="img/pattern/patrn_1.png" alt="" />
    </div>
    <div className="patrn_2 d-none d-lg-block">
      <img src="img/pattern/patrn.png" alt="" />
    </div>
    <div className="container">
      <div className="row">
        <div className="col-xl-12">
          <div className="section_title text-center mb-50 white_text">
            <h3>They use FAQ</h3>
            <p>
              They care about building an Internal Knowledge Base. <br />
              And they use FAQ to do it!
            </p>
          </div>
        </div>
      </div>
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {users.map((user, index) => (
          <div
            key={index}
            style={{
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src={user.image} style={{ maxWidth: '100%', maxHeight: '100%' }} alt={user.name} />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default Users
