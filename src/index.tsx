import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react"
import App from './App'
import * as fire from './fire'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

fire.init()

window.addEventListener('beforeinstallprompt', (e: any) => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return e.preventDefault()
  } else {
    (window as any).pwa = e
    return e.preventDefault()
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.register();