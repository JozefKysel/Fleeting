import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Signup, Login, Footer } from '../components';
import { PrivateRoutes } from '../components';
import Home from './Home'
import './App.less';

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
