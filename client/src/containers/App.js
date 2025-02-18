import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Signup, Login, InputTime, CallPaneCaller, CallPaneReceiver, CallExpired } from '../components';
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
          <Route exact path="/input" component={InputTime}/>
          <Route exact path="/caller" component={CallPaneCaller}/>
          <Route exact path="/callee" component={CallPaneReceiver}/>
          <Route exact path="/expired" component={CallExpired}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
