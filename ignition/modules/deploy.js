async function main() {
  console.log(`Deploying on ${network.name} network...`);
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${await deployer.getAddress()} account...`);
  const factory = await ethers.getContractFactory("EntropyProtocol");
  const protocol = await factory.deploy();
  console.log(`Protocol address: ${protocol.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
