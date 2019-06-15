import React from 'react';
import './App.less';
import Home from './Home'
import { Signup, Login } from '../components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { PrivateRoutes } from '../components';

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
    <BrowserRouter>
      <div className="App">
        <div className="container">
          <Switch>
            <PrivateRoutes component={Home} exact path="/"/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
