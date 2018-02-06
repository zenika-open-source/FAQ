import React, { Component } from 'react';
import { connect } from 'react-redux'

import Searchbar from '~/components/Searchbar';
import QuestionCard from '~/components/QuestionCard';

class Home extends Component {
  render() {
		const {questions,filtered} = this.props;
		console.log(this.props);

		const list = filtered.length > 0 ? filtered.map(x=>x.item) : questions;

		const QuestionsList = list.map((question,index)=>{
			return (<QuestionCard style={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}} question={question} key={index}/>);
		});

    return (
      <div className='Home'>
				<h1 style={{textAlign: 'center'}}>FAQ Zenika</h1>
				<Searchbar style={{marginTop:'3rem', marginBottom: '2rem'}}/>
				{QuestionsList}
      </div>
    );
  }
}

const mapStateToProps = state => state.questions

export default connect(mapStateToProps)(Home)
