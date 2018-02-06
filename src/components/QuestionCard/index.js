import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import Card from 'react-toolbox/lib/card/Card';
import CardText from 'react-toolbox/lib/card/CardText';
import CardTitle from 'react-toolbox/lib/card/CardTitle';

import './style.css';

class QuestionCard extends Component {
	render() {
		const question = this.props.question;

		return (
			<Card className="QuestionCard" {...this.props}>
				<CardTitle
				  avatar="https://placeimg.com/80/80/animals"
				  title={question.question}
				/>
				<CardText>
					<ReactMarkdown source={question.answer}
						renderers={{
							link: props => <a href={props.href} target="_blank">{props.children}</a>,
							table: props => <table className='zui-table'>{props.children}</table>
						}}/>
				</CardText>
			</Card>
		)
	}
}

export default QuestionCard;
