require("@nomicfoundation/hardhat-toolbox");

const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  localhost: {
    forking: {
      url: "https://rpc.sepolia.org",
    },
  },
};
