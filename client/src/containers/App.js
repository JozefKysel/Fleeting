import React from 'react';
import './App.less';
import Home from './Home'
import { NavBar, Footer, Signup } from '../components';

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
      <Signup/>
    </div>
    </div>
  );
}

export default App;
