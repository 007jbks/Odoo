// We import the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the tests in a standalone fashion through `node <testfile>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { expect } = require("chai"); // For assertions
const { ethers } = require("hardhat"); // Hardhat's ethers plugin

describe("ECommerceWallet", function () {
    let ECommerceWallet;
    let wallet;
    let owner;
    let addr1; // Will represent a generic user account, not necessarily linked to a created wallet
    let addr2; // Another generic user account
    let other;

    // Before each test, deploy a fresh contract
    beforeEach(async function () {
        // Get signers (accounts) from Hardhat's local network
        [owner, addr1, addr2, other] = await ethers.getSigners();

        // Get the ContractFactory for ECommerceWallet
        ECommerceWallet = await ethers.getContractFactory("ECommerceWallet");

        // Deploy the contract
        wallet = await ECommerceWallet.deploy();
        await wallet.waitForDeployment(); // Wait for the contract to be deployed
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            // Check if the owner of the contract is the deployer (owner account)
            expect(await wallet.owner()).to.equal(owner.address);
        });
    });

    describe("Ownership Transfers", function () {
        it("Should allow owner to transfer ownership", async function () {
            // Transfer ownership from owner to addr1
            await expect(wallet.transferOwnership(addr1.address))
                .to.emit(wallet, "OwnershipTransferred")
                .withArgs(owner.address, addr1.address);

            // Verify addr1 is the new owner
            expect(await wallet.owner()).to.equal(addr1.address);
        });

        it("Should not allow non-owner to transfer ownership", async function () {
            // Attempt to transfer ownership from addr1 (not owner) to addr2
            await expect(wallet.connect(addr1).transferOwnership(addr2.address))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow transfer to zero address", async function () {
            // Attempt to transfer ownership to the zero address
            await expect(wallet.transferOwnership(ethers.ZeroAddress))
                .to.be.revertedWith("Ownable: new owner is the zero address");
        });
    });

    describe("Wallet Creation", function () {
        const userId1 = "user123";
        const userId2 = "user456";

        it("Should allow the owner to create a wallet for a new user", async function () {
            // Call createWallet and get the transaction response
            const tx = await wallet.createWallet(userId1);
            const receipt = await tx.wait(); // Wait for the transaction to be mined

            // Find the WalletCreated event in the transaction receipt
            const event = receipt.logs.find(log => wallet.interface.parseLog(log)?.name === "WalletCreated");
            const emittedWalletAddress = event.args[1]; // Get the walletAddress from the event

            // Verify the event was emitted with the correct userId and the dynamically generated address
            await expect(tx)
                .to.emit(wallet, "WalletCreated")
                .withArgs(userId1, emittedWalletAddress);

            // Verify the wallet address is not zero
            expect(emittedWalletAddress).to.not.equal(ethers.ZeroAddress);

            // Verify the wallet is registered
            expect(await wallet.isWalletRegistered(emittedWalletAddress)).to.be.true;
        });

        it("Should not allow non-owner to create a wallet", async function () {
            // Attempt to create a wallet by addr1 (not owner)
            await expect(wallet.connect(addr1).createWallet(userId1))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow creating a wallet with an empty userId", async function () {
            // Attempt to create a wallet with an empty userId
            await expect(wallet.createWallet(""))
                .to.be.revertedWith("ECommerceWallet: userId cannot be empty");
        });

        it("Should not allow creating a wallet for an already existing userId", async function () {
            // Create a wallet for userId1 first
            await wallet.createWallet(userId1);

            // Attempt to create another wallet for the same userId1
            await expect(wallet.createWallet(userId1))
                .to.be.revertedWith("ECommerceWallet: wallet already exists for this user");
        });

        it("Should return the correct wallet address for a given userId", async function () {
            // Create a wallet for userId1
            await wallet.createWallet(userId1);
            const expectedAddress = await wallet.getWalletAddress(userId1);

            // Verify getWalletAddress returns the same address
            expect(await wallet.getWalletAddress(userId1)).to.equal(expectedAddress);
        });

        it("Should return false for an unregistered wallet address", async function () {
            // Check an arbitrary address that hasn't been registered
            expect(await wallet.isWalletRegistered(addr1.address)).to.be.false;
        });
    });

    describe("Token Management (addTokens)", function () {
        const initialAmount = ethers.parseUnits("100", 0); // 100 tokens (assuming 0 decimals for simplicity)
        const addAmount = ethers.parseUnits("50", 0);
        let userAddr1WalletAddress; // To store the dynamically generated address for "userAddr1"

        beforeEach(async function () {
            // Create a wallet for "userAddr1" and store its generated address
            await wallet.createWallet("userAddr1");
            userAddr1WalletAddress = await wallet.getWalletAddress("userAddr1");
        });

        it("Should allow owner to add tokens to a user's wallet", async function () {
            // Add tokens to userAddr1WalletAddress's balance
            await expect(wallet.addTokens(userAddr1WalletAddress, addAmount))
                .to.emit(wallet, "TokensAdded")
                .withArgs(userAddr1WalletAddress, addAmount, addAmount);

            // Verify the balance
            expect(await wallet.getBalance(userAddr1WalletAddress)).to.equal(addAmount);
        });

        it("Should allow owner to add tokens using userId", async function () {
            // Add tokens using userId
            await expect(wallet.addTokensByUserId("userAddr1", addAmount))
                .to.emit(wallet, "TokensAdded")
                .withArgs(userAddr1WalletAddress, addAmount, addAmount); // Assert with the actual generated address

            // Verify the balance using both address and userId
            expect(await wallet.getBalance(userAddr1WalletAddress)).to.equal(addAmount);
            expect(await wallet.getBalanceByUserId("userAddr1")).to.equal(addAmount);
        });

        it("Should not allow non-owner to add tokens", async function () {
            // Attempt to add tokens by addr1 (not owner) to a random address
            await expect(wallet.connect(addr1).addTokens(addr2.address, addAmount))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow non-owner to add tokens by userId", async function () {
            // Attempt to add tokens by addr1 (not owner)
            await expect(wallet.connect(addr1).addTokensByUserId("userAddr1", addAmount))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow adding tokens to the zero address", async function () {
            // Attempt to add tokens to the zero address
            await expect(wallet.addTokens(ethers.ZeroAddress, addAmount))
                .to.be.revertedWith("ECommerceWallet: cannot add tokens to the zero address");
        });

        it("Should not allow adding tokens by userId if wallet not found", async function () {
            // Attempt to add tokens for a non-existent userId
            await expect(wallet.addTokensByUserId("nonExistentUser", addAmount))
                .to.be.revertedWith("ECommerceWallet: wallet not found for this user");
        });
    });

    describe("Token Management (subtractTokens)", function () {
        const initialAmount = ethers.parseUnits("100", 0);
        const subtractAmount = ethers.parseUnits("30", 0);
        const excessAmount = ethers.parseUnits("200", 0);
        let userAddr1WalletAddress; // To store the dynamically generated address for "userAddr1"

        beforeEach(async function () {
            // Create a wallet for "userAddr1" and store its generated address
            await wallet.createWallet("userAddr1");
            userAddr1WalletAddress = await wallet.getWalletAddress("userAddr1");
            // Add initial tokens to the GENERATED wallet address
            await wallet.addTokens(userAddr1WalletAddress, initialAmount);
        });

        it("Should allow owner to subtract tokens from a user's wallet", async function () {
            // Subtract tokens from userAddr1WalletAddress's balance
            await expect(wallet.subtractTokens(userAddr1WalletAddress, subtractAmount))
                .to.emit(wallet, "TokensSubtracted")
                .withArgs(userAddr1WalletAddress, subtractAmount, initialAmount - subtractAmount);

            // Verify the new balance
            expect(await wallet.getBalance(userAddr1WalletAddress)).to.equal(initialAmount - subtractAmount);
        });

        it("Should allow owner to subtract tokens using userId", async function () {
            // Subtract tokens using userId
            await expect(wallet.subtractTokensByUserId("userAddr1", subtractAmount))
                .to.emit(wallet, "TokensSubtracted")
                .withArgs(userAddr1WalletAddress, subtractAmount, initialAmount - subtractAmount); // Assert with the actual generated address

            // Verify the new balance using both address and userId
            expect(await wallet.getBalance(userAddr1WalletAddress)).to.equal(initialAmount - subtractAmount);
            expect(await wallet.getBalanceByUserId("userAddr1")).to.equal(initialAmount - subtractAmount);
        });

        it("Should not allow non-owner to subtract tokens", async function () {
            // Attempt to subtract tokens by addr1 (not owner) from a random address
            await expect(wallet.connect(addr1).subtractTokens(addr1.address, subtractAmount))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow non-owner to subtract tokens by userId", async function () {
            // Attempt to subtract tokens by addr1 (not owner)
            await expect(wallet.connect(addr1).subtractTokensByUserId("userAddr1", subtractAmount))
                .to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should not allow subtracting tokens from the zero address", async function () {
            // Attempt to subtract tokens from the zero address
            await expect(wallet.subtractTokens(ethers.ZeroAddress, subtractAmount))
                .to.be.revertedWith("ECommerceWallet: cannot subtract tokens from the zero address");
        });

        it("Should not allow subtracting tokens if insufficient balance", async function () {
            // Attempt to subtract more tokens than available from the generated address
            await expect(wallet.subtractTokens(userAddr1WalletAddress, excessAmount))
                .to.be.revertedWith("ECommerceWallet: insufficient balance");
        });

        it("Should not allow subtracting tokens by userId if wallet not found", async function () {
            // Attempt to subtract tokens for a non-existent userId
            await expect(wallet.subtractTokensByUserId("nonExistentUser", subtractAmount))
                .to.be.revertedWith("ECommerceWallet: wallet not found for this user");
        });
    });

    describe("Balance Queries", function () {
        const amount = ethers.parseUnits("75", 0);
        let userAddr1WalletAddress; // To store the dynamically generated address for "userAddr1"

        beforeEach(async function () {
            // Create a wallet for "userAddr1" and store its generated address
            await wallet.createWallet("userAddr1");
            userAddr1WalletAddress = await wallet.getWalletAddress("userAddr1");
            // Add some tokens to the GENERATED wallet address
            await wallet.addTokens(userAddr1WalletAddress, amount);
        });

        it("Should return the correct balance for a user address", async function () {
            expect(await wallet.getBalance(userAddr1WalletAddress)).to.equal(amount);
        });

        it("Should return 0 for a user with no tokens (if they don't have a created wallet or tokens)", async function () {
            // addr2 has no tokens and no created wallet initially
            expect(await wallet.getBalance(addr2.address)).to.equal(0);
        });

        it("Should return the correct balance for a userId", async function () {
            expect(await wallet.getBalanceByUserId("userAddr1")).to.equal(amount);
        });

        it("Should revert for an unregistered userId when querying balance", async function () {
            // A non-existent userId should revert as the wallet is not found.
            await expect(wallet.getBalanceByUserId("nonExistentUser"))
                .to.be.revertedWith("ECommerceWallet: wallet not found for this user");
        });
    });
});
