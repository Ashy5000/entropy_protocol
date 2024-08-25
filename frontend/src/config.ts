import { http, createConfig } from 'wagmi'
import { mainnet, neonDevnet, sapphire, sepolia } from 'wagmi/chains'

export const config = createConfig({
    chains: [mainnet, sepolia, neonDevnet, sapphire],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [neonDevnet.id]: http(),
        [sapphire.id]: http(),
    },
})
