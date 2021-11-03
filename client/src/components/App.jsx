import React from "react";
import Nav from "./Nav";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from './Register.js'
import ChangePass from './Changepass.js'
import Login from "./Login.js";
import Dashboard from "./Dashboard";
import Forgotpass from "./Forgotpass";


export default function App() {
  return (
    <div>
      <BrowserRouter>
      <Nav />
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/changepass" component={ChangePass} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/forgotpass" component={Forgotpass} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
