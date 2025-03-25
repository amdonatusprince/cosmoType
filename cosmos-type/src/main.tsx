import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Import wallet UI components
import { WalletUi, createWalletUiConfig, createSolanaDevnet, createSolanaMainnet } from '@wallet-ui/react'
import '@wallet-ui/tailwind/index.css'

// Create wallet configuration
const walletConfig = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaMainnet()]
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WalletUi config={walletConfig}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </WalletUi>,
)
