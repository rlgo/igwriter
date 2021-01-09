import React from 'react'
import logo from './logo.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Box } from '@chakra-ui/react'
import Tab from './Tab'

export type navigateCb = (link: "home" | "favorite" | "shared") => void
const navigate: navigateCb = (link) => {
  console.log(link)
}

function App() {
  return (
    <React.Fragment>
      <Box w="100%" id="content" >

      </Box>
      <Tab navigate={navigate} />
    </React.Fragment>
  )
}

export default App
