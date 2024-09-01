
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import styles from "./auth.module.css";
import RPC from "./ethersRPC";
import {Deploy} from "../DeployProvider/DeployProvider.tsx";
import {Stake} from "../Supply/Stake.tsx";
import {ethers} from "ethers";

const clientId =
    "BMrJprSon_bXbIx_yGB426J891BHap2No_OnIM_2GSjNJplQeIzVcPBtw4Er5UI5XGUwr77utCz37Cr7XKSm4yE"; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});

const web3AuthOptions: Web3AuthOptions = {
    clientId,
    chainConfig: { ...chainConfig, chainNamespace: CHAIN_NAMESPACES.EIP155 },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider: privateKeyProvider,
};





const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });

adapters.forEach((adapter) => {
    console.log("Adapter:", adapter);
    web3auth.configureAdapter(adapter);
});

const entropyTokenAddress = "0x877534C6A7bA840c7346b39E6B24b6ac91c5D1a5"
const entropyProviderAddress = "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d"
function Auth({ setVisible }) {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);

                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setVisible(false);

        if (web3authProvider) {
            const ethersProvider = new ethers.BrowserProvider(web3authProvider as ethers.Eip1193Provider);
            setProvider(ethersProvider as unknown as IProvider);
            console.log(ethersProvider);

            if (web3auth.connected) {
                setLoggedIn(true);
            }
        } else {
            console.error("Web3Auth provider is null");
        }
    };



    const logout = async () => {
        await web3auth.logout();
        setVisible(true);
        setProvider(null);
        setLoggedIn(false);
        uiConsole("logged out");
    };



    function uiConsole(...args: any[]): void {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
            console.log(...args);
        }
    }

    const loggedInView = (

        <div className={styles.getInfo}>
            <div className={styles.deployContainer}>
                <Button
                    onClick={logout}
                    size="sm"
                    style={{ backgroundColor: "#45D483", fontWeight: 600 }}
                >
                    Log Out
                </Button>
                <Deploy provider={provider}/>
            </div>
            <div style={{marginTop:'4rem'}}>
                <Stake entropyTokenAddress = {entropyTokenAddress} entropyProviderAddress={entropyProviderAddress} provider={provider} />
            </div>
        </div>
    );

    const unloggedInView = (
        <Button
            onClick={login}
            variant="solid"
            style={{ backgroundColor: "#45D483", fontWeight: 600 }}
        >
            Connect Wallet
        </Button>
    );

    return (
        <div className="container">{loggedIn ? loggedInView : unloggedInView}</div>
    );
}

export default Auth;