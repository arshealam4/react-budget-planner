import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Budget from "./components/budget";
import NavBar from "./components/navBar";
import Add from "./components/add";
import Edit from "./components/edit";
import "react-toastify/dist/ReactToastify.css";

function App() {
  /*
   * react-router-dom is third party library for routing
   * react-toastify is third party library for alert messages
   */
  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/edit/:id" component={Edit} />
          <Route path="/add" component={Add} />
          <Route path="/" exact component={Budget} />
          <Redirect to="/" />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
