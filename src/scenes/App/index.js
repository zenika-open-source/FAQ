import React, { Component } from 'react';

import './style.css';
import theme from '~/toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import '~/toolbox/theme.css';

import Home from '~/scenes/Home';
import Navbar from '~/components/Navbar';

class App extends Component {
  render() {
    return (
      <div className="App">
				<ThemeProvider theme={theme}>
					<div>
						<Navbar/>
			      <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
	        		<Home/>
						</div>
					</div>
				</ThemeProvider>
      </div>
    );
  }
}

export default App
