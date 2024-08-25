// import { useEffect, useState } from "react";
// import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
// import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import Web3 from "web3";
// import {Button} from "@nextui-org/react";
// import styles from './auth.module.css'
//
// // Firebase libraries for custom authentication
// import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider, getAuth, signInWithPopup, UserCredential } from "firebase/auth";
//
//
// // IMP START - Dashboard Registration
// const clientId = "BMrJprSon_bXbIx_yGB426J891BHap2No_OnIM_2GSjNJplQeIzVcPBtw4Er5UI5XGUwr77utCz37Cr7XKSm4yE"; // get from https://dashboard.web3auth.io
//
// const verifier = "w3a-firebase-demo";
//
// const chainConfig = {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: "0x1", // Please use 0x1 for Mainnet
//     rpcTarget: "https://rpc.ankr.com/eth",
//     displayName: "Ethereum Mainnet",
//     blockExplorer: "https://etherscan.io/",
//     ticker: "ETH",
//     tickerName: "Ethereum",
// };
//
// const privateKeyProvider = new EthereumPrivateKeyProvider({
//     config: { chainConfig },
// });
//
// const web3auth = new Web3Auth({
//     clientId, // Get your Client ID from Web3Auth Dashboard
//     web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//     privateKeyProvider,
// });
//
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
//     authDomain: "web3auth-oauth-logins.firebaseapp.com",
//     projectId: "web3auth-oauth-logins",
//     storageBucket: "web3auth-oauth-logins.appspot.com",
//     messagingSenderId: "461819774167",
//     appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
// };
//
// function Auth() {
//     const [provider, setProvider] = useState<IProvider | null>(null);
//     const [loggedIn, setLoggedIn] = useState(false);
//
//     // Firebase Initialisation
//     const app = initializeApp(firebaseConfig);
//
//     useEffect(() => {
//         const init = async () => {
//             try {
//                 await web3auth.init();
//                 setProvider(web3auth.provider);
//
//                 if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
//                     setLoggedIn(true);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };
//
//         init();
//     }, []);
//
//     const signInWithGoogle = async (): Promise<UserCredential> => {
//         try {
//             const auth = getAuth(app);
//             const googleProvider = new GoogleAuthProvider();
//             const res = await signInWithPopup(auth, googleProvider);
//             console.log(res);
//             return res;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     };
//
//
//     const login = async () => {
//         if (!web3auth) {
//             uiConsole("web3auth initialised yet");
//             return;
//         }
//         // login with firebase
//         const loginRes = await signInWithGoogle();
//         // get the id token from firebase
//         const idToken = await loginRes.user.getIdToken(true);
//         const { payload } = decodeToken(idToken);
//
//         const web3authProvider = await web3auth.connect({
//             verifier,
//             verifierId: (payload as any).sub,
//             idToken,
//         });
//
//         if (web3authProvider) {
//             setLoggedIn(true);
//             setProvider(web3authProvider);
//         }
//     };
//
//     const getUserInfo = async () => {
//         const user = await web3auth.getUserInfo();
//         uiConsole(user);
//     };
//
//     const logout = async () => {
//         await web3auth.logout();
//         setProvider(null);
//         setLoggedIn(false);
//         uiConsole("logged out");
//     };
//
//     const getAccounts = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const web3 = new Web3(provider as any);
//
//         // Get user's Ethereum public address
//         const address = await web3.eth.getAccounts();
//         uiConsole(address);
//     };
//
//     const getBalance = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const web3 = new Web3(provider as any);
//
//         // Get user's Ethereum public address
//         const address = (await web3.eth.getAccounts())[0];
//
//         // Get user's balance in ether
//         const balance = web3.utils.fromWei(
//             await web3.eth.getBalance(address), // Balance is in wei
//             "ether"
//         );
//         uiConsole(balance);
//     };
//
//     const signMessage = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const web3 = new Web3(provider as any);
//
//         // Get user's Ethereum public address
//         const fromAddress = (await web3.eth.getAccounts())[0];
//
//         const originalMessage = "YOUR_MESSAGE";
//
//         // Sign the message
//         const signedMessage = await web3.eth.personal.sign(
//             originalMessage,
//             fromAddress,
//             "test password!" // configure your own password here.
//         );
//         uiConsole(signedMessage);
//     };
//
//     function uiConsole(...args: any[]): void {
//         const el = document.querySelector("#console>p");
//         if (el) {
//             el.innerHTML = JSON.stringify(args || {}, null, 2);
//         }
//         console.log(...args);
//     }
//
//     const loggedInView = (
//         <>
//             <div className={styles.getInfo}>
//                 <div>
//                     <Button onClick={getUserInfo} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
//                         Get User Info
//                     </Button>
//                 </div>
//                 <div>
//                     <Button onClick={getAccounts} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
//                         Get Accounts
//                     </Button>
//                 </div>
//                 <div>
//                     <Button onClick={getBalance} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
//                         Get Balance
//                     </Button>
//                 </div>
//                 <div>
//                     <Button onClick={signMessage} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
//                         Sign Message
//                     </Button>
//                 </div>
//                 <div>
//                     <Button onClick={logout} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
//                         Log Out
//                     </Button>
//                 </div>
//             </div>
//         </>
//     );
//
//     const unloggedInView = (
//         <Button onClick={login}  style={{backgroundColor:'#45D483', fontWeight:600, width:'40px'}}>
//             Login
//         </Button>
//     );
//
//     return (
//         <div className="container">
//
//
//             <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
//
//
//
//         </div>
//     );
// }
//
// export default Auth;







import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";
import { useEffect, useState } from "react";
import {Button} from "@nextui-org/react";
import styles from './auth.module.css'

import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";

const clientId = "BMrJprSon_bXbIx_yGB426J891BHap2No_OnIM_2GSjNJplQeIzVcPBtw4Er5UI5XGUwr77utCz37Cr7XKSm4yE"; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
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
    web3AuthNetwork: "sapphire_devnet",
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
});

web3auth.configureAdapter(metamaskAdapter);




metamaskAdapter.setAdapterSettings({
    sessionTime: 86400, // 1 day in seconds
    chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1",
        rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    web3AuthNetwork: "sapphire_mainnet",
});


function Auth() {
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
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
        }
    };

    const getUserInfo = async () => {
        const user = await web3auth.getUserInfo();
        uiConsole(user);
        console.log(user)
    };

    const logout = async () => {
        await web3auth.logout();
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
        console.log(address)
    };

    const getBalance = async () => {
        if (!provider) {
            uiConsole("provider not initialized yet");
            return;
        }
        const balance = await RPC.getBalance(provider);
        uiConsole(balance);
        console.log(balance)
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
        <>
            <div className={styles.getInfo}>
                <div>
                    <Button onClick={getUserInfo} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}} >
                        Get User Info
                    </Button>
                </div>
                <div>
                    <Button onClick={getAccounts} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
                        Get Accounts
                    </Button>
                </div>
                <div>
                    <Button onClick={getBalance} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
                        Get Balance
                    </Button>
                </div>
                <div>
                    <Button onClick={signMessage} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
                        Sign Message
                    </Button>
                </div>
                <div>
                    <Button onClick={sendTransaction} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
                        Send Transaction
                    </Button>
                </div>
                <div>
                    <Button onClick={logout} className="card" size='sm'style={{backgroundColor:'#45D483', fontWeight:600}}>
                        Log Out
                    </Button>
                </div>
            </div>
        </>
    );

    const unloggedInView = (
        <Button onClick={login} variant= "solid" style={{backgroundColor:'#45D483', fontWeight:600, width:'40px'}}>
            Login
        </Button>
    );

    return (
        <div className="container">


            <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>



        </div>
    );
}

export default Auth;