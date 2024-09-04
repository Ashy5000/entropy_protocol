async function main() {
  console.log(`Deploying on ${network.name} network...`);
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${await deployer.getAddress()} account...`);
  const factory = await ethers.getContractFactory("EndConsumer");
  const protocol = await factory.deploy();
  console.log(`Consumer address: ${protocol.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Address: 0x6678b72841bDDe8bf92a419004Eeb6F45301deFF
