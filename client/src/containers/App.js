import React from 'react';
import './App.less';
import Home from './Home'
import { NavBar, Footer, Signup, Login } from '../components';
import { Router, Link } from '@reach/router';

//
// <div className="NavBar">
//   <NavBar />
// </div>
// <div className="Home">
//   <Home />
// </div>
// <div className="Footer">
//   <Footer />
// </div>
function App() {
  return (
    <div className="App">
      <div className="container">
      <Router>
        <Home path="/"/>
        <Login path="login"/>
        <Signup path="signup"/>
      </Router>
      </div>
    </div>
  );
}

export default App;
