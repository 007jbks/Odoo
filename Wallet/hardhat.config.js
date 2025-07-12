require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  solidity: "0.8.28",
  namedAccounts: {
    deployer: {
      default: 0, // First account from the accounts array (PRIVATE_KEY)
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
