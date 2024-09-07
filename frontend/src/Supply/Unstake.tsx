import {Button, Input} from "@nextui-org/react";
import  styles from './unstake.module.css'
import {Contract, parseEther, ethers, parseUnits} from "ethers";
import {useState} from "react";
type AccountData = {
  unstake:number
}
const entropyTokenAddress = "0x877534C6A7bA840c7346b39E6B24b6ac91c5D1a5";
const entropyProtocolAddress = "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d";


const providerABI = [
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "protocol",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "hash",
                type: "uint256",
            },
        ],
        name: "commit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract EntropyConsumer",
                name: "consumer",
                type: "address",
            },
        ],
        name: "pullTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "schemaId",
        outputs: [
            {
                internalType: "uint64",
                name: "",
                type: "uint64",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint64",
                name: "id",
                type: "uint64",
            },
        ],
        name: "setAndLockSchemaId",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "spInstanceAddress",
                type: "address",
            },
        ],
        name: "setAndLockSpInstance",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "spInstance",
        outputs: [
            {
                internalType: "contract ISP",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract EntropyToken",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "stake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "data",
                type: "uint256",
            },
        ],
        name: "supply",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract EntropyToken",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "protocol",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "unstake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract EntropyToken",
                name: "token",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

export function Unstake({
    entropyProviderAddress,
    provider
                        }) {

    const [unstakeAmount, setUnstakeAmount] = useState(0)


    const handleUnstake = async () => {
        try {
            console.log(unstakeAmount)
            console.log(entropyProviderAddress)
            const signer = await provider.getSigner();

            const contract = new Contract(entropyProviderAddress, providerABI, signer);

            const unstakeTx = await contract.unstake(
                entropyTokenAddress,
                entropyProtocolAddress,
                parseUnits(unstakeAmount.toString())
            );
            await unstakeTx.wait();

            const withdrawTx = await contract.withdraw(entropyTokenAddress, parseUnits(unstakeAmount.toString()));
            await withdrawTx.wait();

            alert('Tokens unstaked and withdrawn successfully.');
        } catch (error) {
            console.error('Error while unstaking:', error);
            alert('An error occurred while unstaking.');
        }
    };
  return (
      <>
           <form className={styles.formContainer}>
              <p style={{color:'#ffffff', fontSize:'18px'}}>You cannot unstake when you have unfulfilled commitments</p>
              <Input
                  required
                  label='Amount'
                  type="number"
                  value={unstakeAmount.toString()}
                  variant='bordered'
                  color='success'
                  placeholder='Min 1.00'
                  size='sm'
                  onChange={(e) => setUnstakeAmount(Number(e.target.value))}
                  classNames={{
                      label:'text-white',
                      input:'text-white flex ml-[2rem]'
                  }}
              />
              <Button style={{backgroundColor:'#45D483', fontWeight:600, width:'100%' , marginBottom:'2rem'}} onClick={handleUnstake}>Unstake</Button>
          </form>

      </>
  )
}
