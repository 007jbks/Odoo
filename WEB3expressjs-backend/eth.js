const ethers = require("ethers");

require("dotenv").config();

// === CONFIGURATION ===
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Replace with actual contract address
const ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"TokensAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"TokensSubtracted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"userId","type":"string"},{"indexed":true,"internalType":"address","name":"walletAddress","type":"address"}],"name":"WalletCreated","type":"event"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"userId","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"addTokensByUserId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"userId","type":"string"}],"name":"createWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"userId","type":"string"}],"name":"getBalanceByUserId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"userId","type":"string"}],"name":"getWalletAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"walletAddress","type":"address"}],"name":"isWalletRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"subtractTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"userId","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"subtractTokensByUserId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// === ERROR CODES ===
const ERROR_CODES = {
    INVALID_ADDRESS: 'E001',
    INVALID_AMOUNT: 'E002',
    INVALID_USER_ID: 'E003',
    WALLET_NOT_FOUND: 'E004',
    WALLET_ALREADY_EXISTS: 'E005',
    INSUFFICIENT_BALANCE: 'E006',
    TRANSACTION_FAILED: 'E007',
    NETWORK_ERROR: 'E008',
    CONTRACT_ERROR: 'E009',
    ENVIRONMENT_ERROR: 'E010',
    VALIDATION_ERROR: 'E011',
    UNAUTHORIZED: 'E012'
};

// === VALIDATION FUNCTIONS ===
function validateAddress(address) {
    if (!address || !ethers.utils.isAddress(address)) {
        throw new Error(`${ERROR_CODES.INVALID_ADDRESS}: Invalid Ethereum address: ${address}`);
    }
}

function validateAmount(amount) {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error(`${ERROR_CODES.INVALID_AMOUNT}: Invalid amount: ${amount}. Must be a positive number.`);
    }
}

function validateUserId(userId) {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new Error(`${ERROR_CODES.INVALID_USER_ID}: Invalid user ID: ${userId}. Must be a non-empty string.`);
    }
}

function validateEnvironment() {
    if (!process.env.SEPOLIA_RPC_URL) {
        throw new Error(`${ERROR_CODES.ENVIRONMENT_ERROR}: SEPOLIA_RPC_URL not found in environment variables`);
    }
    if (!process.env.PRIVATE_KEY) {
        throw new Error(`${ERROR_CODES.ENVIRONMENT_ERROR}: PRIVATE_KEY not found in environment variables`);
    }
    if (!CONTRACT_ADDRESS) {
        throw new Error(`${ERROR_CODES.ENVIRONMENT_ERROR}: CONTRACT_ADDRESS not found in environment variables`);
    }
}

// === INITIALIZE PROVIDER AND CONTRACT ===
let provider, wallet, contract;

function initializeContract() {
    try {
        validateEnvironment();
        
        provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
        
        console.log('Contract initialized successfully');
        console.log('Contract address:', CONTRACT_ADDRESS);
        console.log('Provider URL:', process.env.SEPOLIA_RPC_URL);
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Failed to initialize contract:`, error.message);
        throw error;
    }
}

// === INITIALIZE CONTRACT ON MODULE LOAD ===
initializeContract();

// === ENHANCED FUNCTIONS WITH ERROR HANDLING ===

async function getBalance(address) {
    try {
        validateAddress(address);
        
        console.log(`Fetching balance for address: ${address}`);
        const balance = await contract.getBalance(address);
        const formattedBalance = ethers.utils.formatEther(balance);
        
        console.log(`Balance of ${address}: ${formattedBalance} ETH`);
        return formattedBalance;
        
    } catch (error) {
        if (error.message.includes('call revert exception')) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: Wallet not found or not registered: ${address}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: Wallet not found or not registered: ${address}`);
        }
        
        if (error.message.includes('network')) {
            console.error(`${ERROR_CODES.NETWORK_ERROR}: Network error while fetching balance:`, error.message);
            throw new Error(`${ERROR_CODES.NETWORK_ERROR}: Network connection failed`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error fetching balance:`, error.message);
        throw error;
    }
}

async function getBalanceByUserId(userId) {
    try {
        validateUserId(userId);
        
        console.log(`Fetching balance for user ID: ${userId}`);
        const balance = await contract.getBalanceByUserId(userId);
        const formattedBalance = ethers.utils.formatEther(balance);
        
        console.log(`Balance of user ${userId}: ${formattedBalance} ETH`);
        return formattedBalance;
        
    } catch (error) {
        if (error.message.includes('call revert exception')) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error fetching balance by user ID:`, error.message);
        throw error;
    }
}

async function createWallet(userId) {
    try {
        validateUserId(userId);
        
        console.log(`Creating wallet for user ID: ${userId}`);
        
        // Check if wallet already exists
        try {
            const existingWallet = await contract.getWalletAddress(userId);
            if (existingWallet && existingWallet !== ethers.constants.AddressZero) {
                console.error(`${ERROR_CODES.WALLET_ALREADY_EXISTS}: Wallet already exists for user ${userId}: ${existingWallet}`);
                throw new Error(`${ERROR_CODES.WALLET_ALREADY_EXISTS}: Wallet already exists for user ${userId}`);
            }
        } catch (error) {
            // If getWalletAddress fails, it means no wallet exists (expected behavior)
            if (!error.message.includes('call revert exception')) {
                throw error;
            }
        }
        
        const tx = await contract.createWallet(userId);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
        
        const walletAddress = await contract.getWalletAddress(userId);
        console.log(`Wallet created successfully for ${userId}: ${walletAddress}`);
        
        return walletAddress;
        
    } catch (error) {
        if (error.message.includes('insufficient funds')) {
            console.error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient funds for transaction`);
            throw new Error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient funds for gas fees`);
        }
        
        if (error.message.includes('nonce')) {
            console.error(`${ERROR_CODES.TRANSACTION_FAILED}: Transaction nonce error`);
            throw new Error(`${ERROR_CODES.TRANSACTION_FAILED}: Transaction nonce error`);
        }
        
        if (error.message.includes('gas')) {
            console.error(`${ERROR_CODES.TRANSACTION_FAILED}: Gas estimation failed`);
            throw new Error(`${ERROR_CODES.TRANSACTION_FAILED}: Gas estimation failed`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error creating wallet:`, error.message);
        throw error;
    }
}

async function addTokens(address, amountInEther) {
    try {
        validateAddress(address);
        validateAmount(amountInEther);
        
        console.log(`Adding ${amountInEther} tokens to ${address}`);
        
        const amount = ethers.utils.parseEther(amountInEther.toString());
        const tx = await contract.addTokens(address, amount);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
        
        console.log(`Successfully added ${amountInEther} tokens to ${address}`);
        return receipt;
        
    } catch (error) {
        if (error.message.includes('Ownable: caller is not the owner')) {
            console.error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can add tokens`);
            throw new Error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can add tokens`);
        }
        
        if (error.message.includes('insufficient funds')) {
            console.error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient funds for transaction`);
            throw new Error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient funds for gas fees`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error adding tokens:`, error.message);
        throw error;
    }
}

async function addTokensByUserId(userId, amountInEther) {
    try {
        validateUserId(userId);
        validateAmount(amountInEther);
        
        console.log(`Adding ${amountInEther} tokens to user ${userId}`);
        
        const amount = ethers.utils.parseEther(amountInEther.toString());
        const tx = await contract.addTokensByUserId(userId, amount);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
        
        console.log(`Successfully added ${amountInEther} tokens to user ${userId}`);
        return receipt;
        
    } catch (error) {
        if (error.message.includes('Ownable: caller is not the owner')) {
            console.error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can add tokens`);
            throw new Error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can add tokens`);
        }
        
        if (error.message.includes('call revert exception')) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error adding tokens by user ID:`, error.message);
        throw error;
    }
}

async function subtractTokens(address, amountInEther) {
    try {
        validateAddress(address);
        validateAmount(amountInEther);
        
        console.log(`Subtracting ${amountInEther} tokens from ${address}`);
        
        // Check current balance
        const currentBalance = await contract.getBalance(address);
        const requestedAmount = ethers.utils.parseEther(amountInEther.toString());
        
        if (currentBalance.lt(requestedAmount)) {
            console.error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient balance. Current: ${ethers.utils.formatEther(currentBalance)}, Requested: ${amountInEther}`);
            throw new Error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient balance`);
        }
        
        const amount = ethers.utils.parseEther(amountInEther.toString());
        const tx = await contract.subtractTokens(address, amount);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
        
        console.log(`Successfully subtracted ${amountInEther} tokens from ${address}`);
        return receipt;
        
    } catch (error) {
        if (error.message.includes('Ownable: caller is not the owner')) {
            console.error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can subtract tokens`);
            throw new Error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can subtract tokens`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error subtracting tokens:`, error.message);
        throw error;
    }
}

async function subtractTokensByUserId(userId, amountInEther) {
    try {
        validateUserId(userId);
        validateAmount(amountInEther);
        
        console.log(`Subtracting ${amountInEther} tokens from user ${userId}`);
        
        // Check current balance
        const currentBalance = await contract.getBalanceByUserId(userId);
        const requestedAmount = ethers.utils.parseEther(amountInEther.toString());
        
        if (currentBalance.lt(requestedAmount)) {
            console.error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient balance for user ${userId}. Current: ${ethers.utils.formatEther(currentBalance)}, Requested: ${amountInEther}`);
            throw new Error(`${ERROR_CODES.INSUFFICIENT_BALANCE}: Insufficient balance for user ${userId}`);
        }
        
        const amount = ethers.utils.parseEther(amountInEther.toString());
        const tx = await contract.subtractTokensByUserId(userId, amount);
        console.log(`Transaction submitted: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
        
        console.log(`Successfully subtracted ${amountInEther} tokens from user ${userId}`);
        return receipt;
        
    } catch (error) {
        if (error.message.includes('Ownable: caller is not the owner')) {
            console.error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can subtract tokens`);
            throw new Error(`${ERROR_CODES.UNAUTHORIZED}: Only contract owner can subtract tokens`);
        }
        
        if (error.message.includes('call revert exception')) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error subtracting tokens by user ID:`, error.message);
        throw error;
    }
}

async function getWalletAddress(userId) {
    try {
        validateUserId(userId);
        
        console.log(`Fetching wallet address for user ID: ${userId}`);
        const walletAddress = await contract.getWalletAddress(userId);
        
        if (walletAddress === ethers.constants.AddressZero) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
        }
        
        console.log(`Wallet address for user ${userId}: ${walletAddress}`);
        return walletAddress;
        
    } catch (error) {
        if (error.message.includes('call revert exception')) {
            console.error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
            throw new Error(`${ERROR_CODES.WALLET_NOT_FOUND}: No wallet found for user ID: ${userId}`);
        }
        
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error fetching wallet address:`, error.message);
        throw error;
    }
}

async function isWalletRegistered(walletAddress) {
    try {
        validateAddress(walletAddress);
        
        console.log(`Checking if wallet is registered: ${walletAddress}`);
        const isRegistered = await contract.isWalletRegistered(walletAddress);
        
        console.log(`Wallet ${walletAddress} is ${isRegistered ? 'registered' : 'not registered'}`);
        return isRegistered;
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error checking wallet registration:`, error.message);
        throw error;
    }
}

// === EXPORT FUNCTIONS FOR EXTERNAL USE ===
module.exports = {
    getBalance,
    getBalanceByUserId,
    createWallet,
    addTokens,
    addTokensByUserId,
    subtractTokens,
    subtractTokensByUserId,
    getWalletAddress,
    isWalletRegistered,
    ERROR_CODES
};