const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  
  try {
    // Get named accounts with error handling
    const namedAccounts = await getNamedAccounts();
    const { deployer } = namedAccounts;
    
    // Verify deployer exists
    if (!deployer) {
      throw new Error("Deployer account not found. Please check your hardhat.config.js namedAccounts configuration.");
    }
    
    // Log deployment info
    log("----------------------------------------------------");
    log("Deploying ECommerceWallet contract...");
    log(`Deployer account: ${deployer}`);
    
    // Get the contract factory to ensure it exists
    const ECommerceWalletFactory = await ethers.getContractFactory("ECommerceWallet");
    log("Contract factory loaded successfully");
    
    // Deploy the contract
    const eCommerceWallet = await deploy("ECommerceWallet", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: 1,
    });
    
    log(`ECommerceWallet deployed to: ${eCommerceWallet.address}`);
    log("----------------------------------------------------");
    
  } catch (error) {
    log("Error during deployment:");
    log(error.message);
    throw error;
  }
};

module.exports.tags = ["ECommerceWallet"];