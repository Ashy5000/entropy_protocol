import styles from './wallet.module.css'
import {useState} from "react";
import Auth from '../WebAuth/Auth.tsx'
import {Stake} from "../Supply/Stake.tsx";
const Wallet = () =>{
const [visible , setVisible] = useState(true)
    return(
        <>
            <div className={styles.backgroundContainer}>
                 <div className={styles.connectDiv} >
                     <div className={styles.headingStyle}>
                         {visible ?   <h1>Connect Your Wallet to Get Started</h1> : null}
                     </div>
                     <div className={styles.authContainer}>
                         <Auth visible={visible} setVisible = {setVisible}/>
                     </div>
                 </div>
                 <div className={styles.supplyDiv}>
                        <div className={styles.headingStyle}>
                            <h1>Supply Randomness</h1>
                        </div>
                       <div>
                           <Stake />
                       </div>
                 </div>
            </div>
        </>
    )
}

export default Wallet