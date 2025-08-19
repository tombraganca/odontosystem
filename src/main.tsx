import ReactDOM from 'react-dom/client'

import './index.css'
import App from './app.tsx'
import reportWebVitals from './reportWebVitals.ts'

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}

reportWebVitals()
