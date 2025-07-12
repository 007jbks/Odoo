// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

/**
 * @title ECommerceWallet
 * @dev A simplified wallet contract for an e-commerce site where the backend
 * manages user token balances.
 * This contract is owned by a single address (the backend's address) which
 * has the sole authority to add and subtract tokens from user accounts.
 * All balance changes are recorded on the blockchain via events for transparency.
 */
contract ECommerceWallet is Ownable {
    // Mapping from user address (or unique ID represented as address) to their token balance
    mapping(address => uint256) private _balances;
    
    // Mapping from user ID to their assigned wallet address
    mapping(string => address) private _userWallets;
    
    // Mapping to check if a wallet address is registered
    mapping(address => bool) private _isRegistered;
    
    // Counter for generating unique wallet addresses
    uint256 private _walletCounter;

    // Event emitted when tokens are added to a user's balance
    event TokensAdded(address indexed user, uint256 amount, uint256 newBalance);

    // Event emitted when tokens are subtracted from a user's balance
    event TokensSubtracted(address indexed user, uint256 amount, uint256 newBalance);
    
    // Event emitted when a new wallet is created for a user
    event WalletCreated(string indexed userId, address indexed walletAddress);

    /**
     * @dev Creates a new wallet address for a user identified by userId.
     * Only the contract owner (backend) can call this function.
     * @param userId The unique identifier for the user (e.g., email, username, or UUID).
     * @return walletAddress The generated wallet address for the user.
     */
    function createWallet(string memory userId) public onlyOwner returns (address) {
        require(bytes(userId).length > 0, "ECommerceWallet: userId cannot be empty");
        require(_userWallets[userId] == address(0), "ECommerceWallet: wallet already exists for this user");
        
        // Generate a deterministic address based on contract address, userId, and counter
        address walletAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            address(this),
            userId,
            _walletCounter,
            block.timestamp
        )))));
        
        // Ensure the generated address is not already registered
        while (_isRegistered[walletAddress]) {
            _walletCounter++;
            walletAddress = address(uint160(uint256(keccak256(abi.encodePacked(
                address(this),
                userId,
                _walletCounter,
                block.timestamp
            )))));
        }
        
        _userWallets[userId] = walletAddress;
        _isRegistered[walletAddress] = true;
        _walletCounter++;
        
        emit WalletCreated(userId, walletAddress);
        return walletAddress;
    }

    /**
     * @dev Returns the wallet address for a given userId.
     * @param userId The unique identifier for the user.
     * @return The wallet address associated with the userId.
     */
    function getWalletAddress(string memory userId) public view returns (address) {
        return _userWallets[userId];
    }

    /**
     * @dev Checks if a wallet address is registered in the system.
     * @param walletAddress The address to check.
     * @return True if the address is registered, false otherwise.
     */
    function isWalletRegistered(address walletAddress) public view returns (bool) {
        return _isRegistered[walletAddress];
    }

    /**
     * @dev Adds a specified `amount` of tokens to a `user`'s balance.
     * Only the contract owner (backend) can call this function.
     * @param user The address (or unique ID) of the user whose balance will be increased.
     * @param amount The amount of tokens to add.
     */
    function addTokens(address user, uint256 amount) public onlyOwner {
        require(user != address(0), "ECommerceWallet: cannot add tokens to the zero address");
        _balances[user] += amount; // Safely adds tokens (handles overflow if amount is huge, but unlikely for balances)
        emit TokensAdded(user, amount, _balances[user]);
    }

    /**
     * @dev Convenience function to add tokens using userId instead of address.
     * Only the contract owner (backend) can call this function.
     * @param userId The unique identifier for the user.
     * @param amount The amount of tokens to add.
     */
    function addTokensByUserId(string memory userId, uint256 amount) public onlyOwner {
        address userAddress = _userWallets[userId];
        require(userAddress != address(0), "ECommerceWallet: wallet not found for this user");
        addTokens(userAddress, amount);
    }

    /**
     * @dev Subtracts a specified `amount` of tokens from a `user`'s balance.
     * Only the contract owner (backend) can call this function.
     * Requires that the user has sufficient balance.
     * @param user The address (or unique ID) of the user whose balance will be decreased.
     * @param amount The amount of tokens to subtract.
     */
    function subtractTokens(address user, uint256 amount) public onlyOwner {
        require(user != address(0), "ECommerceWallet: cannot subtract tokens from the zero address");
        require(_balances[user] >= amount, "ECommerceWallet: insufficient balance");
        _balances[user] -= amount; // Safely subtracts tokens
        emit TokensSubtracted(user, amount, _balances[user]);
    }

    /**
     * @dev Convenience function to subtract tokens using userId instead of address.
     * Only the contract owner (backend) can call this function.
     * @param userId The unique identifier for the user.
     * @param amount The amount of tokens to subtract.
     */
    function subtractTokensByUserId(string memory userId, uint256 amount) public onlyOwner {
        address userAddress = _userWallets[userId];
        require(userAddress != address(0), "ECommerceWallet: wallet not found for this user");
        subtractTokens(userAddress, amount);
    }

    /**
     * @dev Returns the current token balance of a specific `user`.
     * @param user The address (or unique ID) of the user.
     * @return The balance of the user.
     */
    function getBalance(address user) public view returns (uint256) {
        return _balances[user];
    }

    /**
     * @dev Convenience function to get balance using userId instead of address.
     * @param userId The unique identifier for the user.
     * @return The balance of the user.
     */
    function getBalanceByUserId(string memory userId) public view returns (uint256) {
        address userAddress = _userWallets[userId];
        require(userAddress != address(0), "ECommerceWallet: wallet not found for this user");
        return _balances[userAddress];
    }
}