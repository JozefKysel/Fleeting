import React from 'react';
import './App.less';
import Home from './Home'
import { Signup, Login, Footer } from '../components';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { PrivateRoutes } from '../components';


function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <PrivateRoutes component={Home} exact path="/"/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
