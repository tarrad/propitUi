import React from 'react';
import Dashboard from './Dashboard/index'
import Login from './Login/index'
import Register from './Register/index'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
        <Router>
        <Redirect exact from="/" to="/dashboard" />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Router>
    </div>
  );
}

export default App;
