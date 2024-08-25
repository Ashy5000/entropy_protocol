import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure , Spinner} from "@nextui-org/react";

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
                    <p className="text-white    ">Randomizer</p>
                </NavbarBrand>
                <NavbarContent className=" sm:flex gap-4">
                    <NavbarItem>
                        <Link style={{color:'white'}} href="#">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#" aria-current="page" style={{color:'white'}}>
                            Customers
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#" style={{color:'white'}}>
                            Integrations
                        </Link>
                    </NavbarItem>

                </NavbarContent>
                <NavbarContent justify="end">
                    {/*<NavbarItem>*/}
                    {/*    <Button style={{backgroundColor:'#45D483', fontWeight:600}} onPress={onOpen}>*/}
                    {/*        Connect Wallet*/}
                    {/*    </Button>*/}
                    {/*</NavbarItem>*/}
                    {/*<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='sm' style={{width:'350px' , border:'1px solid #6b7280'}}>*/}
                    {/*    <ModalContent>*/}
                    {/*        {(onClose) => (*/}
                    {/*            <>*/}
                    {/*                <ModalHeader className="flex flex-col gap-1" style={{backgroundColor:'#0a0a0a' , color:'white'}}>Connect a Wallet</ModalHeader>*/}
                    {/*                {visible ? <div style={{backgroundColor:'#0a0a0a' , display:'flex' , justifyContent:'center' , alignItems:'center' , flexDirection:'column' , paddingTop:'2rem'}}>*/}
                    {/*                    <Spinner color="primary" style={{backgroundColor:'#0a0a0a'}} />*/}
                    {/*                    <p style={{fontSize:'20px' , fontWeight:'500' , backgroundColor:'#0a0a0a' , color:'white' ,}}>Waiting for Connection</p>*/}
                    {/*                </div> : null}*/}

                    {/*                <ModalBody style={{backgroundColor:'#0a0a0a', color:'white'}}>*/}
                    {/*                    {!visible ?  <div style={{display:'flex' , flexDirection:'column' , gap:'16px'}}>*/}
                    {/*                        <div style={{display:'flex' , flexDirection:'row' , gap:'16px' , cursor:'pointer'}} >*/}
                    {/*                            <img src={metamask}  alt="metamask" />*/}
                    {/*                            <p style={{fontSize:'20px' , fontWeight:'500'}}>Metamask</p>*/}
                    {/*                        </div>*/}
                    {/*                        <div style={{display:'flex' , flexDirection:'row' , gap:'16px' , cursor:'pointer'}}>*/}
                    {/*                            <img src={wallet}  alt="metamask" />*/}
                    {/*                            <p style={{fontSize:'20px' , fontWeight:'500'}}>WalletConnect</p>*/}
                    {/*                        </div>*/}
                    {/*                        <div style={{display:'flex' , flexDirection:'row' , gap:'16px' , cursor:'pointer'}}>*/}
                    {/*                            <img src={web3auth}  alt="web3auth" />*/}
                    {/*                            <p style={{fontSize:'20px' , fontWeight:'500'}}>Web3Auth</p>*/}
                    {/*                        </div>*/}

                    {/*                    </div> : null}*/}


                    {/*                </ModalBody>*/}

                    {/*            </>*/}
                    {/*        )}*/}
                    {/*    </ModalContent>*/}
                    {/*</Modal>*/}
                    <NavbarItem>
                        <Auth />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    )
}

export default Nav