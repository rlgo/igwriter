import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Tab from './Tab'
import Page from './Page';

type HomePageProps = {
  path: Path
}

function HomePage({ path }: HomePageProps) {
  return (
    <React.Fragment>
      <Page path={path} />
      <Tab path={path} />
    </React.Fragment>
  )
}

export enum Path {
  HOME = "/home",
  FAVORITES = "/favorites",
  SHARED = "/shared"
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path={Path.HOME}>
          <HomePage path={Path.HOME} />
        </Route>
        <Route path={Path.FAVORITES}>
          <HomePage path={Path.FAVORITES} />
        </Route>
        <Route path={Path.SHARED}>
          <HomePage path={Path.SHARED} />
        </Route>

        {/* {default to home path} */}
        <Route path="/">
          <Redirect to={Path.HOME} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
