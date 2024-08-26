import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from '@nextui-org/react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WagmiProvider } from 'wagmi'
import { config } from './config'
import Wallet from './Wallet/Wallet.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path:'/wallet',
        element:<Wallet />
    }

]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router}>
          <WagmiProvider config={config}>
              <NextUIProvider>
                  <App />
              </NextUIProvider>
          </WagmiProvider>
      </RouterProvider>
  </StrictMode>,
)
