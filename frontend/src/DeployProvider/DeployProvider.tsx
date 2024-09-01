import {Button, Input} from "@nextui-org/react";
import styles from './deploy.module.css'
import {ContractFactory, Contract, ethers } from 'ethers'
import {useState} from "react";


const contractABI = [
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

const contractByteCode = "0x6080604052600a6001556000600360146101000a81548160ff02191690831515021790555060006003601d6101000a81548160ff02191690831515021790555034801561004b57600080fd5b5033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506113c98061009c6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c806384bf15351161006657806384bf153514610131578063a8c5dc331461014d578063adc9772e1461016b578063d7d99dc814610187578063f3fef3a3146101a35761009e565b8063075b1a09146100a357806308228c0e146100c157806335403023146100dd5780633adfd5a6146100f957806360829f8a14610115575b600080fd5b6100ab6101bf565b6040516100b89190610a9e565b60405180910390f35b6100db60048036038101906100d69190610b1c565b6101d9565b005b6100f760048036038101906100f29190610b7f565b6102b4565b005b610113600480360381019061010e9190610bea565b6103ff565b005b61012f600480360381019061012a9190610c55565b610465565b005b61014b60048036038101906101469190610ca8565b610535565b005b6101556107c2565b6040516101629190610d47565b60405180910390f35b61018560048036038101906101809190610d62565b6107e8565b005b6101a1600480360381019061019c9190610dce565b6108b5565b005b6101bd60048036038101906101b89190610d62565b610978565b005b600360159054906101000a900467ffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461023757610236610dfb565b5b600360149054906101000a900460ff161561025557610254610dfb565b5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600360146101000a81548160ff02191690831515021790555050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461031257610311610dfb565b5b6000808154811061032657610325610e2a565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d743b56b826040518263ffffffff1660e01b81526004016103899190610e68565b600060405180830381600087803b1580156103a357600080fd5b505af11580156103b7573d6000803e3d6000fd5b50505050600080815481106103cf576103ce610e2a565b5b9060005260206000200160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550565b6000819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104c3576104c2610dfb565b5b8273ffffffffffffffffffffffffffffffffffffffff16638381e18282846040518363ffffffff1660e01b81526004016104fe929190610ea4565b600060405180830381600087803b15801561051857600080fd5b505af115801561052c573d6000803e3d6000fd5b50505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461059357610592610dfb565b5b600154600080549050106105aa576105a9610dfb565b5b6000600167ffffffffffffffff8111156105c7576105c6610ecd565b5b6040519080825280602002602001820160405280156105fa57816020015b60608152602001906001900390816105e55790505b5090508260405160200161060e9190610f0b565b6040516020818303038152906040528160008151811061063157610630610e2a565b5b60200260200101819052506000604051806101400160405280600360159054906101000a900467ffffffffffffffff1667ffffffffffffffff168152602001600067ffffffffffffffff168152602001600067ffffffffffffffff168152602001600067ffffffffffffffff1681526020013073ffffffffffffffffffffffffffffffffffffffff168152602001600067ffffffffffffffff168152602001600060038111156106e4576106e3610f26565b5b8152602001600015158152602001838152602001846040516020016107099190610e68565b6040516020818303038152906040528152509050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b82916cb826040518263ffffffff1660e01b81526004016107789190611274565b6020604051808303816000875af1158015610797573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107bb91906112e4565b5050505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461084657610845610dfb565b5b8173ffffffffffffffffffffffffffffffffffffffff1663a694fc3a826040518263ffffffff1660e01b815260040161087f9190610e68565b600060405180830381600087803b15801561089957600080fd5b505af11580156108ad573d6000803e3d6000fd5b505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461091357610912610dfb565b5b6003601d9054906101000a900460ff161561093157610930610dfb565b5b80600360156101000a81548167ffffffffffffffff021916908367ffffffffffffffff16021790555060016003601d6101000a81548160ff02191690831515021790555050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146109d6576109d5610dfb565b5b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836040518363ffffffff1660e01b8152600401610a33929190611311565b6020604051808303816000875af1158015610a52573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a769190611366565b505050565b600067ffffffffffffffff82169050919050565b610a9881610a7b565b82525050565b6000602082019050610ab36000830184610a8f565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610ae982610abe565b9050919050565b610af981610ade565b8114610b0457600080fd5b50565b600081359050610b1681610af0565b92915050565b600060208284031215610b3257610b31610ab9565b5b6000610b4084828501610b07565b91505092915050565b6000819050919050565b610b5c81610b49565b8114610b6757600080fd5b50565b600081359050610b7981610b53565b92915050565b600060208284031215610b9557610b94610ab9565b5b6000610ba384828501610b6a565b91505092915050565b6000610bb782610ade565b9050919050565b610bc781610bac565b8114610bd257600080fd5b50565b600081359050610be481610bbe565b92915050565b600060208284031215610c0057610bff610ab9565b5b6000610c0e84828501610bd5565b91505092915050565b6000610c2282610ade565b9050919050565b610c3281610c17565b8114610c3d57600080fd5b50565b600081359050610c4f81610c29565b92915050565b600080600060608486031215610c6e57610c6d610ab9565b5b6000610c7c86828701610c40565b9350506020610c8d86828701610b07565b9250506040610c9e86828701610b6a565b9150509250925092565b60008060408385031215610cbf57610cbe610ab9565b5b6000610ccd85828601610b07565b9250506020610cde85828601610b6a565b9150509250929050565b6000819050919050565b6000610d0d610d08610d0384610abe565b610ce8565b610abe565b9050919050565b6000610d1f82610cf2565b9050919050565b6000610d3182610d14565b9050919050565b610d4181610d26565b82525050565b6000602082019050610d5c6000830184610d38565b92915050565b60008060408385031215610d7957610d78610ab9565b5b6000610d8785828601610c40565b9250506020610d9885828601610b6a565b9150509250929050565b610dab81610a7b565b8114610db657600080fd5b50565b600081359050610dc881610da2565b92915050565b600060208284031215610de457610de3610ab9565b5b6000610df284828501610db9565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b610e6281610b49565b82525050565b6000602082019050610e7d6000830184610e59565b92915050565b6000610e8e82610d14565b9050919050565b610e9e81610e83565b82525050565b6000604082019050610eb96000830185610e59565b610ec66020830184610e95565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610f0581610ade565b82525050565b6000602082019050610f206000830184610efc565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b610f5e81610a7b565b82525050565b610f6d81610ade565b82525050565b60048110610f8457610f83610f26565b5b50565b6000819050610f9582610f73565b919050565b6000610fa582610f87565b9050919050565b610fb581610f9a565b82525050565b60008115159050919050565b610fd081610fbb565b82525050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561103c578082015181840152602081019050611021565b60008484015250505050565b6000601f19601f8301169050919050565b600061106482611002565b61106e818561100d565b935061107e81856020860161101e565b61108781611048565b840191505092915050565b600061109e8383611059565b905092915050565b6000602082019050919050565b60006110be82610fd6565b6110c88185610fe1565b9350836020820285016110da85610ff2565b8060005b8581101561111657848403895281516110f78582611092565b9450611102836110a6565b925060208a019950506001810190506110de565b50829750879550505050505092915050565b6000610140830160008301516111416000860182610f55565b5060208301516111546020860182610f55565b5060408301516111676040860182610f55565b50606083015161117a6060860182610f55565b50608083015161118d6080860182610f64565b5060a08301516111a060a0860182610f55565b5060c08301516111b360c0860182610fac565b5060e08301516111c660e0860182610fc7565b506101008301518482036101008601526111e082826110b3565b9150506101208301518482036101208601526111fc8282611059565b9150508091505092915050565b600082825260208201905092915050565b50565b600061122a600083611209565b91506112358261121a565b600082019050919050565b600082825260208201905092915050565b600061125e600083611240565b91506112698261121a565b600082019050919050565b6000608082019050818103600083015261128e8184611128565b905081810360208301526112a18161121d565b905081810360408301526112b481611251565b905081810360608301526112c781611251565b905092915050565b6000815190506112de81610da2565b92915050565b6000602082840312156112fa576112f9610ab9565b5b6000611308848285016112cf565b91505092915050565b60006040820190506113266000830185610efc565b6113336020830184610e59565b9392505050565b61134381610fbb565b811461134e57600080fd5b50565b6000815190506113608161133a565b92915050565b60006020828403121561137c5761137b610ab9565b5b600061138a84828501611351565b9150509291505056fea26469706673582212203be975b68f82a991c18a024acc1113e55f3527e6fdc9635911e2db7e26f931de64736f6c63430008140033"


export const Deploy = ({provider}) => {
    const [deployedContractAddress, setDeployedContractAddress] = useState("");
    const [existingContractAddress, setExistingContractAddress] = useState("");
    const deployContract = async () => {


        try {
            console.log(provider)

            const network = await provider.getNetwork();
            console.log(network);
            const signer = await provider.getSigner()
            console.log(signer)

            const contractFactory = new ContractFactory(contractABI, contractByteCode, signer);

            const contract = await contractFactory.deploy(); // Deploy the contract

            await contract.waitForDeployment()

            const address = await contract.getAddress()
            console.log(address)
            alert(`Contract deployed at ${address}`)



        } catch (error) {
            console.error("Contract deployment failed:", error);
            alert("Contract deployment failed. Check the console for details.");
        }
    };

    const getExistingContract = async () => {
        try {
            if (!existingContractAddress) {
                alert("Please provide a valid contract address");
                return;
            }
            const signer = await provider.getSigner()
            console.log(signer)

            const network = await provider.getNetwork();
            console.log('Connected to network:', network.chainId);  // Ensure this matches your deployment network
            console.log(existingContractAddress)
            const code = await provider.getCode(existingContractAddress);
            console.log('Contract code at address:', code);

            if (code === '0x') {
                alert("No contract is deployed at this address");
                return;
            }

            const contract = new Contract(existingContractAddress, contractABI, signer);

            const contractAddress = await contract.getAddress(); // Get the contract address
            setExistingContractAddress(contractAddress); // Update state with the new address

            alert(`Contract deployed at address: ${contractAddress}`);
            console.log(`Contract deployed at address: ${contractAddress}`);


        } catch (error) {
            console.error("Failed to interact with the contract:", error);
            alert("Failed to interact with the contract. Check the console for details.");
        }
    };

    return(
        <>
            <form className={styles.formContainer} onSubmit={e => e.preventDefault()}>
                <h1 style={{color: 'white', fontSize: '24px'}}>Deploy Contract</h1>

                <Input
                    required
                    label='Address'
                    type="text"
                    variant='bordered'
                    color='success'
                    size='sm'
                    classNames={{
                        label: 'text-white',
                        input: 'text-white flex ml-[2rem]'
                    }}
                    value={existingContractAddress}
                    onChange={e => setExistingContractAddress(e.target.value)}

                />
                <div className='flex flex-row  w-full justify-between '>
                    <Button style={{
                        backgroundColor: '#45D483',
                        fontWeight: 600,
                        width: '45%',
                    }}
                            onClick={getExistingContract}

                    >Submit</Button>
                    <Button style={{
                        backgroundColor: '#45D483',
                        fontWeight: 600,
                        width: '45%',
                        marginBottom: '2rem'
                    }}
                            onClick={deployContract}
                    >Deploy</Button>
                </div>

            </form>
        </>
    )
}


