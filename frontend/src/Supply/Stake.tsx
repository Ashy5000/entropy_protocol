import {Button, Input} from "@nextui-org/react";
import {useState} from "react";
import {Contract, parseUnits} from 'ethers';
import {Commit} from "./Commit.tsx";
import styles from './stake.module.css'
type UserData = {
  tokens: number;
}

type UserFormProps = UserData & {
  updateFields: (fields: Partial<UserData>) => void
}


export function Stake({

    provider,
    entropyTokenAddress,
    entropyProviderAddress
}: UserFormProps) {
    const [error, setError] = useState('')
    const [stakeAmount, setStakeAmount] = useState(0);
    const [stake , setStake] = useState(true)

   const tokenABI = [
       {
           "constant": true,
           "inputs": [],
           "name": "name",
           "outputs": [
               {
                   "name": "",
                   "type": "string"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": false,
           "inputs": [
               {
                   "name": "_spender",
                   "type": "address"
               },
               {
                   "name": "_value",
                   "type": "uint256"
               }
           ],
           "name": "approve",
           "outputs": [
               {
                   "name": "",
                   "type": "bool"
               }
           ],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [],
           "name": "totalSupply",
           "outputs": [
               {
                   "name": "",
                   "type": "uint256"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": false,
           "inputs": [
               {
                   "name": "_from",
                   "type": "address"
               },
               {
                   "name": "_to",
                   "type": "address"
               },
               {
                   "name": "_value",
                   "type": "uint256"
               }
           ],
           "name": "transferFrom",
           "outputs": [
               {
                   "name": "",
                   "type": "bool"
               }
           ],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [],
           "name": "decimals",
           "outputs": [
               {
                   "name": "",
                   "type": "uint8"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [
               {
                   "name": "_owner",
                   "type": "address"
               }
           ],
           "name": "balanceOf",
           "outputs": [
               {
                   "name": "balance",
                   "type": "uint256"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [
               {
                   "name": "_owner",
                   "type": "address"
               }
           ],
           "name": "stakedBalanceOf",
           "outputs": [
               {
                   "name": "balance",
                   "type": "uint256"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [],
           "name": "symbol",
           "outputs": [
               {
                   "name": "",
                   "type": "string"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "constant": false,
           "inputs": [
               {
                   "name": "_to",
                   "type": "address"
               },
               {
                   "name": "_value",
                   "type": "uint256"
               }
           ],
           "name": "transfer",
           "outputs": [
               {
                   "name": "",
                   "type": "bool"
               }
           ],
           "payable": false,
           "stateMutability": "nonpayable",
           "type": "function"
       },
       {
           "constant": true,
           "inputs": [
               {
                   "name": "_owner",
                   "type": "address"
               },
               {
                   "name": "_spender",
                   "type": "address"
               }
           ],
           "name": "allowance",
           "outputs": [
               {
                   "name": "",
                   "type": "uint256"
               }
           ],
           "payable": false,
           "stateMutability": "view",
           "type": "function"
       },
       {
           "payable": true,
           "stateMutability": "payable",
           "type": "fallback"
       },
       {
           "anonymous": false,
           "inputs": [
               {
                   "indexed": true,
                   "name": "owner",
                   "type": "address"
               },
               {
                   "indexed": true,
                   "name": "spender",
                   "type": "address"
               },
               {
                   "indexed": false,
                   "name": "value",
                   "type": "uint256"
               }
           ],
           "name": "Approval",
           "type": "event"
       },
       {
           "anonymous": false,
           "inputs": [
               {
                   "indexed": true,
                   "name": "from",
                   "type": "address"
               },
               {
                   "indexed": true,
                   "name": "to",
                   "type": "address"
               },
               {
                   "indexed": false,
                   "name": "value",
                   "type": "uint256"
               }
           ],
           "name": "Transfer",
           "type": "event"
       }
   ]

    const providerABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "protocol",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "hash",
                    "type": "uint256"
                }
            ],
            "name": "commit",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract EntropyConsumer",
                    "name": "consumer",
                    "type": "address"
                }
            ],
            "name": "pullTo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "schemaId",
            "outputs": [
                {
                    "internalType": "uint64",
                    "name": "",
                    "type": "uint64"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint64",
                    "name": "id",
                    "type": "uint64"
                }
            ],
            "name": "setAndLockSchemaId",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spInstanceAddress",
                    "type": "address"
                }
            ],
            "name": "setAndLockSpInstance",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "spInstance",
            "outputs": [
                {
                    "internalType": "contract ISP",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract EntropyToken",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "stake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "data",
                    "type": "uint256"
                }
            ],
            "name": "supply",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract EntropyToken",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "protocol",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "unstake",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "contract EntropyToken",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]




    function handleInputChange(e){
        const value = Number(e.target.value)
        setStakeAmount(value)
        if(value === 0){
            setError('Stake Amount cannot be empty')
        }else{
            setError('')
        }
    }

    async function handleStake(event) {
        event.preventDefault();

        if (error || stakeAmount <= 0) {
            return;
        }

        try {


            const signer = await provider.getSigner();

            const address = await signer.getAddress()
            console.log(address)

            const entropyTokenContract = new Contract(
                entropyTokenAddress,
                tokenABI,
                signer
            );

            const entropyProviderContract = new Contract(
                entropyProviderAddress,
                providerABI,
                signer
            );



            const transferTx = await entropyTokenContract.transfer(
                entropyProviderAddress,
                parseUnits(stakeAmount.toString(), 18)
            );
            await transferTx.wait();

            const stakeTx = await entropyProviderContract.stake(
                entropyTokenAddress,
                parseUnits(stakeAmount.toString(), 18)
            );

            await stakeTx.wait();

        } catch (err) {
            console.error(err);
            setError('Transaction failed. Please try again.');
        }


    }



  return (
      <>
              <form className={styles.formContainer}>
                  <h1 style={{ color: 'white', fontSize: '24px' }}>Supply Randomness</h1>
                  {error && <p style={{ color: '#dc2626' }}>{error}</p>}
                  <Input
                      required
                      label='Stake Amount'
                      type="number"
                      variant='bordered'
                      color='success'
                      placeholder='Min 1.00'
                      size='sm'
                      onChange={handleInputChange}
                      classNames={{
                          label: 'text-white',
                          input: 'text-white flex ml-[2rem]'
                      }}
                  />
                  <Button
                      style={{
                          backgroundColor: '#45D483',
                          fontWeight: 600,
                          width: '100%',
                          marginBottom: '2rem'
                      }}
                      onClick={handleStake}
                  >
                      Stake
                  </Button>
              </form>
          <Commit />
    </>
  )
}
