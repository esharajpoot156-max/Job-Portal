import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { ThemeProvider } from './utils/ThemeContext.jsx'
import { SocketProvider } from './utils/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)