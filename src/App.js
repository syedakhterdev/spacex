import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Rocket from "./components/Rocket";
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rocket/:id" component={Rocket} />
      </Switch>
    </Router>
  );
}

export default App;
