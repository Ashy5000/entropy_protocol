import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from '@nextui-org/react'
import { WagmiProvider } from 'wagmi'
import { config } from './config'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <WagmiProvider config={config}>
              <NextUIProvider>
                  <App />
              </NextUIProvider>
      </WagmiProvider>
  </StrictMode>,
)
