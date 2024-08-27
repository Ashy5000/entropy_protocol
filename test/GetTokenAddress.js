const fs = require("fs");

async function main() {
  const protocolAbiString = fs.readFileSync("test/protocolabi.json");
  const protocolAbi = JSON.parse(protocolAbiString);
  const [owner] = await ethers.getSigners();
  const protocol = new ethers.Contract(
    "0xe5198b01e2103c46f12725f9ed6c2ef62d54da44",
    protocolAbi,
    owner,
  );
  const tokenAddress = await protocol.getToken();
  console.log(tokenAddress);
}

main();
