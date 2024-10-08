import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure , Spinner} from "@nextui-org/react";
import { Link } from "react-router-dom";

import styles from './nav.module.css'
import Auth from '../WebAuth/Auth.tsx'
import {useState} from "react";
import web3auth from '../assets/web3auth.svg'
import metamask from '../assets/metamask.svg'
import wallet from '../assets/WalletConnect.svg'
const Nav = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [visible , setVisible] = useState(false)


    return(
        <>
            <Navbar position="static" style={{backgroundColor:'#09111D'}} className={styles.borderBottom} maxWidth={"full"}>
                <NavbarBrand>
                    <p className="text-white">Entropy Protocol</p>
                </NavbarBrand>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link to='/wallet'>
                            <Button style={{backgroundColor:'#45D483', fontWeight:600, width:'40px'}}>Open App</Button>
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    )
}

export default Nav