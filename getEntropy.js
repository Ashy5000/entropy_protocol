const fs = require("fs");

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function main() {
  const endConsumerAbiString = fs.readFileSync("test/endconsumerabi.json");
  const endConsumerAbi = JSON.parse(endConsumerAbiString);
  const protocolAbiString = fs.readFileSync("test/protocolabi.json");
  const protocolAbi = JSON.parse(protocolAbiString);
  const tokenAbiString = fs.readFileSync("test/erc20abi.json");
  const tokenAbi = JSON.parse(tokenAbiString);
  const [signer] = await ethers.getSigners();
  const protocol = new ethers.Contract(
    "0x4a7f8abdae59f7aaf4b6d8629314b32e968b4c0d",
    protocolAbi,
    signer,
  );
  try {
    await protocol.setAndLockSpInstance(
      "0x878c92fd89d8e0b93dc0a3c907a2adc7577e39c5",
    );
  } catch (error) {
    console.log("spInstance already set");
  }
  const tokenAddress = await protocol.getToken();
  const token = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const consumer = new ethers.Contract(
    "0x6678b72841bDDe8bf92a419004Eeb6F45301deFF",
    endConsumerAbi,
    signer,
  );
  await token.transfer(consumer, BigInt(1_000000000000000));
  await protocol.pullEntropy(1, consumer);
  console.log("Sent pullEntropy request");
  const oldData = await consumer.getLastBlock();
  console.log(oldData);
  while (true) {
    try {
      let result = await consumer.getLastBlock();
      if (result != oldData) {
        console.log("RANDOM DATA: ", result);
        break;
      }
    } catch (error) {
      console.log("...");
    }
    await sleep(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
