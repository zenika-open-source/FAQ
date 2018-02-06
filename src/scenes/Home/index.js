import React, { Component } from 'react';

import Searchbar from '~/components/Searchbar';
import QuestionCard from '~/components/QuestionCard';

import questions from '~/questions.json';

class Home extends Component {
  render() {
		const QuestionsList = questions.list.map((question,index)=>{
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

export default Home
