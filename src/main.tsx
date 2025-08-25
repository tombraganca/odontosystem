import ReactDOM from 'react-dom/client'

import './index.css'
import App from './app.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import reportWebVitals from './reportWebVitals.ts'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <ThemeProvider defaultTheme="system" storageKey="odontosystem-ui-theme">
      <App />
    </ThemeProvider>
  )
}

reportWebVitals()
