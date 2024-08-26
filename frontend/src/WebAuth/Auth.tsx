import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import styles from "./auth.module.css";
import RPC from "./ethersRPC";

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

const metamaskAdapter = new MetamaskAdapter({
    clientId,
    sessionTime: 3600, // 1 hour in seconds
    web3AuthNetwork: "sapphire_mainnet",
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
});

// it will add/update  the metamask adapter in to web3auth class
web3auth.configureAdapter(metamaskAdapter);

// You can change the adapter settings by calling the setAdapterSettings() function on the adapter instance.
metamaskAdapter.setAdapterSettings({
    sessionTime: 86400, // 1 day in seconds
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    web3AuthNetwork: "sapphire_mainnet",
});



function Auth({setVisible}) {
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
        setVisible(false)
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
        }
    };

    const getUserInfo = async () => {
        const user = await web3auth.getUserInfo();
        uiConsole(user);
    };

    const logout = async () => {
        await web3auth.logout();
        setVisible(true)
        setProvider(null);
        setLoggedIn(false);
        uiConsole("logged out");
    };

    // Check the RPC file for the implementation
    const getAccounts = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const address = await RPC.getAccounts(provider);
        uiConsole(address);
    };

    const getBalance = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const balance = await RPC.getBalance(provider);
        uiConsole(balance);
    };

    const signMessage = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const signedMessage = await RPC.signMessage(provider);
        uiConsole(signedMessage);
    };

    const sendTransaction = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        uiConsole("Sending Transaction...");
        const transactionReceipt = await RPC.sendTransaction(provider);
        uiConsole(transactionReceipt);
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
            <Button onClick={getUserInfo} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Get User Info
            </Button>
            <Button onClick={getAccounts} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Get Accounts
            </Button>
            <Button onClick={getBalance} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Get Balance
            </Button>
            <Button onClick={signMessage} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Sign Message
            </Button>
            <Button onClick={sendTransaction} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Send Transaction
            </Button>
            <Button onClick={logout} size="sm" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
                Log Out
            </Button>
        </div>
    );

    const unloggedInView = (
        <Button onClick={login} variant="solid" style={{ backgroundColor: "#45D483", fontWeight: 600 }}>
            Connect Wallet
        </Button>
    );

    return <div className="container">{loggedIn ? loggedInView : unloggedInView}</div>;
}

export default Auth;


