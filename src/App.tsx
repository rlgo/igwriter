import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Tab from './Tab'
import Page from './Page';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "./fire";
import Draft from './Draft';
import Setting from "./Setting";

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
  RECENT = "/recent",
  FAVORITES = "/favorites",
  SHARED = "/shared",
  SEARCH = "/search",
  DRAFT = "/draft",
  SETTING = "/setting"
}

function App() {
  const [auth, loading] = useAuthState(firebase.auth())
  useEffect(() => {
    if (!auth && !loading)
      firebase.auth().signInAnonymously()
  }, [auth, loading])

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
        <Route path={Path.RECENT}>
          <HomePage path={Path.RECENT} />
        </Route>
        <Route path={Path.SEARCH}>
          <HomePage path={Path.SEARCH} />
        </Route>
        <Route path={Path.DRAFT + "/:id"}>
          <Draft />
        </Route>
        <Route path={Path.SETTING}>
          <Setting />
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
