const express = require('express');
const router = express.Router();
const {
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
} = require('../eth'); 

// === WALLET CREATION ===
router.post('/createWallet', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_USER_ID}: User ID is required`
            });
        }

        console.log('Creating wallet for user ID:', userId);
        const walletAddress = await createWallet(userId);
        
        res.json({
            success: true,
            data: {
                userId,
                walletAddress,
                message: 'Wallet created successfully'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error creating wallet:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === GET WALLET ADDRESS ===
router.get('/getWalletAddress', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_USER_ID}: User ID is required`
            });
        }

        console.log('Getting wallet address for user ID:', userId);
        const walletAddress = await getWalletAddress(userId);
        
        res.json({
            success: true,
            data: {
                userId,
                walletAddress
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error getting wallet address:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === GET BALANCE BY ADDRESS ===
router.get('/getBalance', async (req, res) => {
    try {
        const { address } = req.body;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_ADDRESS}: Address is required`
            });
        }

        console.log('Getting balance for address:', address);
        const balance = await getBalance(address);
        
        res.json({
            success: true,
            data: {
                address,
                balance,
                unit: 'ETH'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error getting balance:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === GET BALANCE BY USER ID ===
router.get('/getBalanceByUserId', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_USER_ID}: User ID is required`
            });
        }

        console.log('Getting balance for user ID:', userId);
        const balance = await getBalanceByUserId(userId);
        
        res.json({
            success: true,
            data: {
                userId,
                balance,
                unit: 'ETH'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error getting balance by user ID:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === ADD TOKENS BY ADDRESS ===
router.post('/addTokens', async (req, res) => {
    try {
        const { address, amount } = req.body;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_ADDRESS}: Address is required`
            });
        }
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_AMOUNT}: Amount is required`
            });
        }

        console.log(`Adding ${amount} tokens to address:`, address);
        const receipt = await addTokens(address, amount);
        
        res.json({
            success: true,
            data: {
                address,
                amount,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                message: 'Tokens added successfully'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error adding tokens:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === ADD TOKENS BY USER ID ===
router.post('/addTokensByUserId', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_USER_ID}: User ID is required`
            });
        }
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_AMOUNT}: Amount is required`
            });
        }

        console.log(`Adding ${amount} tokens to user ID:`, userId);
        const receipt = await addTokensByUserId(userId, amount);
        
        res.json({
            success: true,
            data: {
                userId,
                amount,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                message: 'Tokens added successfully'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error adding tokens by user ID:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === SUBTRACT TOKENS BY ADDRESS ===
router.post('/subtractTokens', async (req, res) => {
    try {
        const { address, amount } = req.body;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_ADDRESS}: Address is required`
            });
        }
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_AMOUNT}: Amount is required`
            });
        }

        console.log(`Subtracting ${amount} tokens from address:`, address);
        const receipt = await subtractTokens(address, amount);
        
        res.json({
            success: true,
            data: {
                address,
                amount,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                message: 'Tokens subtracted successfully'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error subtracting tokens:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === SUBTRACT TOKENS BY USER ID ===
router.post('/subtractTokensByUserId', async (req, res) => {
    try {
        const { userId, amount } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_USER_ID}: User ID is required`
            });
        }
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_AMOUNT}: Amount is required`
            });
        }

        console.log(`Subtracting ${amount} tokens from user ID:`, userId);
        const receipt = await subtractTokensByUserId(userId, amount);
        
        res.json({
            success: true,
            data: {
                userId,
                amount,
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                message: 'Tokens subtracted successfully'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error subtracting tokens by user ID:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === CHECK IF WALLET IS REGISTERED ===
router.get('/isWalletRegistered', async (req, res) => {
    try {
        const { walletAddress } = req.body;
        
        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                error: `${ERROR_CODES.INVALID_ADDRESS}: Wallet address is required`
            });
        }

        console.log('Checking if wallet is registered:', walletAddress);
        const isRegistered = await isWalletRegistered(walletAddress);
        
        res.json({
            success: true,
            data: {
                walletAddress,
                isRegistered,
                status: isRegistered ? 'Registered' : 'Not registered'
            }
        });
        
    } catch (error) {
        console.error(`${ERROR_CODES.CONTRACT_ERROR}: Error checking wallet registration:`, error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// === DEBUG ENDPOINT ===
router.get('/debug/contract', (req, res) => {
    res.json({
        success: true,
        data: {
            contractAddress: process.env.CONTRACT_ADDRESS,
            rpcUrl: process.env.SEPOLIA_RPC_URL,
            hasPrivateKey: !!process.env.PRIVATE_KEY,
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

module.exports = router;