import { Button, Input, Progress } from "@nextui-org/react";
import styles from "./commit.module.css";
import { useState } from "react";
import { sha256, toUtf8Bytes, Contract } from "ethers";

type randomData = {
  block: number;
};

type randomDataProps = randomData & {
  updateFields: (fields: Partial<randomData>) => void;
};

export function Commit({ provider, entropyProviderAddress }) {
  const [progress, setProgress] = useState(false);
  const [randomData, setRandomData] = useState(0);

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

  function handleInputChange(e) {
    const value = Number(e.target.value);
    setRandomData(value);
  }

  async function randomCommit() {
    setProgress(true);

    const dataToHash = toUtf8Bytes(randomData.toString());

    const hashHex = sha256(dataToHash);
    const randomDataHash = BigInt(hashHex);

    const signer = await provider.getSigner();

    const commitContract = new Contract(
      entropyProviderAddress,
      providerABI,
      signer,
    );
    console.log(entropyProviderAddress);

    try {
      const commitTx = await commitContract.commit(
        "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d",
        randomDataHash,
      );
      await commitTx.wait();

      // let waitingCount = 0;
      // while (waitingCount === 0) {
      //   waitingCount = await commitContract.getWaitingConsumerCount();
      //   if (waitingCount > 0) {
      //     break;
      //   }
      // }

      // const supplyTx = await commitContract.supply(randomDataHash);
      // await supplyTx.wait();

      // console.log("Data submitted successfully!");
      // setProgress(false);
      // alert("Commitment Successful");
    } catch (error) {
      console.error("Error committing data:", error);
    }
  }

  return (
    <>
      {!progress ? (
        <form className={styles.commitContainer}>
          <h1 style={{ color: "white", fontSize: "24px" }}>Commit</h1>
          <p style={{ color: "#dc2626", fontSize: "18px" }}>
            After this step there is no going back, Do not close your browser
            until all commitments have been fulfilled.
          </p>
          <Input
            required
            label="Blocks to Supply"
            type="number"
            variant="bordered"
            color="success"
            placeholder="Min 1.00"
            size="sm"
            onChange={handleInputChange}
            classNames={{
              label: "text-white",
              input: "text-white flex ml-[2rem]",
            }}
          />
          <Button
            style={{
              backgroundColor: "#45D483",
              fontWeight: 600,
              width: "100%",
              marginBottom: "2rem",
            }}
            onClick={randomCommit}
          >
            Commit
          </Button>
        </form>
      ) : null}
      {progress ? (
        <div className={styles.commitContainer}>
          <Progress
            size="md"
            isIndeterminate
            aria-label="Progress"
            color="success"
            className="max-w-md"
          />
        </div>
      ) : null}
    </>
  );
}
