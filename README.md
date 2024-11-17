# Voting DApp

This project is a decentralized voting application designed specifically for the Arbitrum network but can also be tested locally using local network. It leverages Solidity for smart contract logic and JavaScript scripts for deployment and interaction, allowing users to create, manage, and participate in voting processes on the blockchain.

## Table of Contents

1. [Voting DApp](#voting-dapp)
2. [Table of Contents](#table-of-contents)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Install Dependencies](#2-install-dependencies)
   - [3. Configure MetaMask for the Arbitrum Sepolia Testnet (Optional)](#3-configure-metamask-for-the-arbitrum-sepolia-testnet-optional)
      - [Step 1: Install MetaMask](#step-1-install-metamask)
      - [Step 2: Create a Wallet](#step-2-create-a-wallet)
      - [Step 3: Add the Arbitrum Sepolia Testnet to MetaMask](#step-3-add-the-arbitrum-sepolia-testnet-to-metamask)
      - [Step 4: Obtain Testnet ETH](#step-4-obtain-testnet-eth)
5. [Environment Configuration](#environment-configuration)
6. [Deployment](#deployment)
   - [Local Deployment](#local-deployment)
   - [Arbitrum Deployment](#arbitrum-deployment)
7. [Testing the Application](#testing-the-application)
8. [Running Tests](#running-tests)
9. [Scripts Overview](#scripts-overview)
   - [Deployment](#deployment-1)
   - [Candidate Management](#candidate-management)
   - [Voting Process Control](#voting-process-control)
   - [Status and Results](#status-and-results)
   - [Voting Action](#voting-action)
10. [Troubleshooting](#troubleshooting)
    - [1. CONTRACT_ADDRESS Not Set](#1-contract_address-not-set)
    - [2. Insufficient Funds](#2-insufficient-funds)
    - [3. Local Network Issues](#3-local-network-issues)
    - [4. MetaMask Configuration Issues](#4-metamask-configuration-issues)
    - [5. Deployment Script Errors](#5-deployment-script-errors)
    - [6. Voting Period Not Ending](#6-voting-period-not-ending)
    - [7. Hardhat Node Resets](#7-hardhat-node-resets)
    - [8. Test Failures](#8-test-failures)
    - [9. Faucet Issues](#9-faucet-issues)
## Prerequisites

Ensure the following are installed on your system:

- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher)
- **Hardhat** (installed locally in this project)
- **Metamask** or another wallet if testing on Arbitrum testnet.

 ## Setup
(#3-configure-metamask-for-the-arbitrum-sepolia-testnet-optional)
Follow these steps to set up and test the **VotingDApp**. Setting up a wallet for testing on the Arbitrum Sepolia Testnet is optional [(Step 3)](#3-configure-metamask-for-the-arbitrum-sepolia-testnet-optional).

 ### 1. Clone the Repository

 Clone this repository and navigate to the project directory:

 ```bash
 git clone https://gitlab.inf.unibe.ch/crypto-public/sem-crypto-hs24-arb.git
 cd sem-crypto-hs24-arb/dapp2/VotingDApp
 ```

 ### 2. Install Dependencies

 Install the necessary project dependencies:

 ```bash
 npm install
 ```

 ### 3. Configure MetaMask for the Arbitrum Sepolia Testnet (Optional)

 To test the application on the Arbitrum Sepolia testnet, you can set up MetaMask or any compatible wallet that supports Arbitrum Sepolia. Here's what to do:

 #### Step 1: Install MetaMask

 1. Download and install the [MetaMask](https://metamask.io/) browser extension or mobile app.
 2. Launch MetaMask and click **"Get Started"**.

 #### Step 2: Create a Wallet

 1. Click **"Create a new Wallet"**.
 2. Set a strong password and proceed.
 3. Securely save your Secret Recovery Phrase. **Do not share this phrase with anyone.**
 4. Confirm the phrase to complete wallet creation.

 #### Step 3: Add the Arbitrum Sepolia Testnet to MetaMask

 1. Open MetaMask and click the profile icon in the top-right corner.
 2. Navigate to **Settings > Security & privacy > Add a custom network**.
 3. Fill in the following details:
    - **Network Name**: `Arbitrum Sepolia Testnet`
    - **RPC URL**: `https://sepolia-rollup.arbitrum.io/rpc`
    - **Chain ID**: `421614`
    - **Currency Symbol**: `ETH`
    - **Block Explorer URL**: [Sepolia Arbiscan](https://sepolia.arbiscan.io)
 4. Click **Save** to add the network.
 5. Select `Arbitrum Sepolia Testnet` from the network list.

 #### Step 4: Obtain Testnet ETH

 You’ll need testnet ETH to deploy and test your smart contracts. Follow these steps:

 1. Obtain free testnet ETH using a faucet:
   - [L2 Faucet](https://www.l2faucet.com/arbitrum/) (recommended)
   - [Arbitrum Sepolia Faucet List](https://arbitrum.faucet.dev/ArbSepolia) (List)
 2. Enter your MetaMask wallet address and follow the faucet instructions. You can find your wallet address in MetaMask by opening the extension, selecting your account, and copying the address displayed at the top of the wallet (it starts with `0x`). Alternatively, you can also find your address by clicking the **Receive** button in MetaMask.
 3. If faucet services are unavailable, check the [Arbitrum Network Status](https://status.arbitrum.io/) to ensure the Arbitrum Sepolia network is operational.

 **You're ready to test your application on the Arbitrum Sepolia Testnet!**

## Environment Configuration

1. Create a `.env` file in the root directory:

   ```bash
   touch .env
   ```

2. Add the following environment variables to `.env` (The file can be left blank if you want to use the project local network):

   ```plaintext
   # Arbitrum Sampoia (Arbitrum Network Settings)
   ARBITRUM_SAMPOIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"

   # Private key for deployment
   PRIVATE_KEY="<YOUR_PRIVATE_KEY>"

   # Local Network Settings
   localhost_url="http://127.0.0.1:8545"
   pk_localhost="<LOCAL_PRIVATE_KEY>"

   # Contract Address (leave blank for deployment)
   CONTRACT_ADDRESS=""
   ```

   > **Note:** This project is designed for Arbitrum, so ensure the `ARBITRUM_SAMPOIA_RPC_URL` is configured correctly. Keep your private key secure.

## Deployment

### Local Deployment

1. Start a local Hardhat node in a new terminal:

   ```bash
   npx hardhat node
   ```

   >**Note**: If the previous command encounters an error, ensure the following:
   >
   >- The `PRIVATE_KEY` and `pk_localhost` variables contain valid private keys in the `.env` file.
   >
   >If these keys/values are missing or invalid, either:
   >  - Add a valid value for the corresponding key.
   >  - For `pk_localhost`, you can use the following Hardhat private key:
   >    `"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"`.
   >  - Remove these keys if they are unnecessary for your deployment:
   >    - `PRIVATE_KEY` for Arbitrum Deployment
   >    - `pk_localhost` for Local Deployment.

2. Deploy the contract to the local network:

   ```bash
   npm run local
   ```

   This script is designed to automate the setup of the '.env' file by checking if the local Hardhat node is running and deploying the contract to it. It will update the .env file with essential keys, including the contract address and private keys, if the file was initially empty.

   > **Note:** If any issues arise with the local script or the .env file setup, you can configure the .env file manually as described in the documentation. After setting up the environment variables manually, deploy the contract by running the deployment script directly:
   >```bash
   >npm run local:deploy
   >```

### Arbitrum Deployment

For deployment on the Arbitrum Sampoia network:

1. Compile the contracts:

   ```bash
   npx hardhat compile
   ```

2. Deploy the contract to Arbitrum:

   ```bash
   npm run sampoia:deploy
   ```

   Upon successful deployment, the `CONTRACT_ADDRESS` will automatically update in your `.env` file. If not, copy the contract address from the console output and paste it manually into the `.env` file.

## Testing the Application

After deployment, follow these steps to test the voting process:

1. **Add Candidates**:

   ```bash
   npm run local:add        # Local Network
   ```
   ```bash
   npm run sampoia:add      # Arbitrum Network
   ```

2. **Start Voting Process**:
   Set `VOTING_DURATION` in `.env` (e.g., `600` for 10 minutes) and run:

   ```bash
   npm run local:start      # Local Network
   ```
   ```bash
   npm run sampoia:start    # Arbitrum Network
   ```

3. **Cast a Vote**:
   Specify `candidateIndex` in `05-Vote.js` and execute:

   ```bash
   npm run local:vote       # Local Network
   ```
   ```bash
   npm run sampoia:vote     # Arbitrum Network
   ```

4. **Retrieve Voting Results**:

   ```bash
   npm run local:votes      # Local Network
   ```
   ```bash
   npm run sampoia:votes    # Arbitrum Network
   ```

5. **End Voting Process**:
   After the voting period ends, finalize the process:

   ```bash
   npm run local:end        # Local Network
   ```
   ```bash
   npm run sampoia:end      # Arbitrum Network
   ```

   > **Note:** You can check if the voting period has ended by running the time script:

   ```bash
   npm run local:time       # Local Network
   ```
   ```bash
   npm run sampoia:time     # Arbitrum Network
   ```

   > **Important:** When using the local network, the remaining time is only updated when a change of state occurs in the contract (e.g., casting a vote). To update the remaining time, please vote using another private key.

## Running Tests

This project includes automated tests that run on a non-persistent network. To execute all tests, use:

```bash
npm run test
```

> **Note:** The tests run using the hardhat network, which is temporary and resets with each test run. Running npx hardhat test without specifying the Hardhat network will not work as expected because it requires a non-persistent network. By default, the Hardhat network is set to be persistent to simulate a working environment similar to the Arbitrum network. Please use 'npx hardhat test --network hardhat' or 'npm run test' to ensure the tests run correctly on the intended non-persistent network.

## Scripts Overview

After deployment, follow these commands to interact with the Voting DApp:

### **Deployment**

1. **Deploy the Contract**: Deploys the smart contract

   ```bash
   npm run local          # Local Network
   ```
   ```bash
   npm run sampoia:deploy # Arbitrum Network
   ```

---

### **Candidate Management**

1. **Add Candidates**: Adds one or more candidates to the contract 

   ```bash
   npm run local:add        # Local Network
   ```
   ```bash
   npm run sampoia:add      # Arbitrum Network
   ```

2. **Remove Candidates**:    Removes a candidate by index from the contract

   ```bash
   npm run local:remove     # Local Network
   ```
   ```bash
   npm run sampoia:remove   # Arbitrum Network
   ```

---

### **Voting Process Control**

1. **Start Voting Process**:    Initiates the voting period

   ```bash
   npm run local:start      # Local Network
   ```
   ```bash
   npm run sampoia:start    # Arbitrum Network
   ```

2. **End Voting Process**:    Finalizes the voting period and locks in the results

   ```bash
   npm run local:end        # Local Network
   ```
   ```bash
   npm run sampoia:end      # Arbitrum Network
   ```

---

### **Status and Results**

1. **Retrieve Remaining Time**:    Fetches the remaining time for the voting period

   ```bash
   npm run local:time       # Local Network
   ```
   ```bash
   npm run sampoia:time     # Arbitrum Network
   ```

   > **Note:** When using the local network, the remaining time is only updated when a change of state occurs in the contract (e.g., casting a vote). To update the remaining time, please vote using another private key.

2. **Check Voting Status**:    Retrieves the current status of the voting process (e.g., active or ended)

   ```bash
   npm run local:status     # Local Network
   ```
   ```bash
   npm run sampoia:status   # Arbitrum Network
   ```

3. **Fetch Candidate Details**:     Lists all candidates and their details

   ```bash
   npm run local:candidates # Local Network
   ```
   ```bash
   npm run sampoia:candidates # Arbitrum Network
   ```

4. **Display Vote Count**:   Displays the vote count for each candidate


   ```bash
   npm run local:votes      # Local Network
   ```
   ```bash
   npm run sampoia:votes    # Arbitrum Network
   ```

5. **Retrieve Candidate Indices**:    Retrieves the indices of all candidates 

   ```bash
   npm run local:indices    # Local Network
   ```
   ```bash
   npm run sampoia:indices  # Arbitrum Network
   ```

---

### **Voting Action**

1. **Cast a Vote**:    Casts a vote for a specified candidate index

   ```bash
   npm run local:vote       # Local Network
   ```
   ```bash
   npm run sampoia:vote     # Arbitrum Network
   ```

## Troubleshooting

This section provides solutions for common issues you might encounter while deploying or interacting with the Voting DApp.

### **1. CONTRACT_ADDRESS Not Set**

**Problem**: The `CONTRACT_ADDRESS` in the `.env` file is empty or missing after deployment.

**Solution**:
- Ensure that the contract deployment was successful. Check the terminal for the contract address after running the deployment script.
- If the address is displayed in the terminal but not updated in `.env`, manually copy and paste the address into the `CONTRACT_ADDRESS` variable.
- Double-check that the `.env` file is correctly formatted and saved without additional spaces or invalid characters.

---

### **2. Insufficient Funds**

**Problem**: Deployment or transactions fail due to lack of ETH in the wallet for gas fees.

**Solution**:
- For local testing:
  - Use the Hardhat node’s pre-funded accounts. These accounts already have a large amount of ETH for testing purposes.
- For Arbitrum Sepolia:
  - Obtain testnet ETH from a trusted faucet. For example:
    - [L2 Faucet](https://www.l2faucet.com/arbitrum/)
    - [Arbitrum Sepolia Faucet List](https://arbitrum.faucet.dev/ArbSepolia)
  - Check your MetaMask wallet balance to confirm receipt of ETH. If the funds do not arrive, try using another faucet or verify the network configuration in MetaMask.

---

### **3. Local Network Issues**

**Problem**: Scripts fail to run on the local network or the deployment process times out.

**Solution**:
- Verify that the Hardhat local node is running:
  - Open a terminal and start the node with `npx hardhat node`.
- Ensure the `pk_localhost` variable in the `.env` file is correctly set with a valid private key. You can use the default Hardhat testing private key:  
  `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`.
- Confirm that the local network URL is correctly configured:
  - `localhost_url="http://127.0.0.1:8545"`

---

### **4. MetaMask Configuration Issues**

**Problem**: MetaMask is not connecting to the correct network, or transactions fail to process.

**Solution**:
- Check that MetaMask is configured for the correct network:
  - For local testing, ensure MetaMask is connected to the localhost network at `http://127.0.0.1:8545`.
  - For Arbitrum Sepolia, verify that the network is added and active with the correct RPC URL:  
    `https://sepolia-rollup.arbitrum.io/rpc`.
- Ensure your wallet has sufficient funds to cover gas fees.

---

### **5. Deployment Script Errors**

**Problem**: Deployment scripts fail to execute or terminate with errors.

**Solution**:
- Confirm that all dependencies are installed by running `npm install`.
- Check the Hardhat configuration (`hardhat.config.js`) for any syntax errors or missing configurations.
- If deploying to Arbitrum Sepolia, verify that the `ARBITRUM_SAMPOIA_RPC_URL` and `PRIVATE_KEY` variables are set in the `.env` file.

---

### **6. Voting Period Not Ending**

**Problem**: The voting period remains active even after the specified time duration.

**Solution**:
- Remember that the voting period duration is updated only when a state change occurs (e.g., casting a vote). If the voting period appears to be stuck, trigger a state change by interacting with the contract (e.g., add a vote or finalize the process).
- Double-check the `VOTING_DURATION` in the `.env` file to ensure it is set correctly.

---

### **7. Hardhat Node Resets**

**Problem**: The local network state resets when restarting the Hardhat node, causing deployed contracts and data to disappear.

**Solution**:
- Avoid restarting the Hardhat node during testing. If a restart is necessary, re-deploy the contracts and reset the `.env` variables accordingly.
- Use Hardhat's `scripts` to automate re-deployment and setup after a node restart.

---

### **8. Test Failures**

**Problem**: Automated tests fail or do not produce the expected results.

**Solution**:
- Verify that the Hardhat network is set to a non-persistent mode for testing:
  - Run tests using `npm run test` or `npx hardhat test --network hardhat`.
- Check for syntax errors or incorrect assumptions in the test scripts.
- If you made changes to the contract, ensure the tests are updated to match the new functionality.

---

### **9. Faucet Issues**

**Problem**: Faucets do not provide testnet ETH, or funds are delayed.

**Solution**:
- Try alternative faucets if the one you are using is unavailable or out of funds.
- Check the [Arbitrum Network Status](https://status.arbitrum.io/) for any ongoing issues with the Sepolia network.
- If possible, request testnet ETH from a colleague or team member who has access to the testnet.

---
