# Voting DApp

This project is a decentralized voting application designed specifically for the Arbitrum network but can also be tested locally using local network. It leverages Solidity for smart contract logic and JavaScript scripts for deployment and interaction, allowing users to create, manage, and participate in voting processes on the blockchain.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment](#deployment)
   - [Local Deployment](#local-deployment)
   - [Arbitrum Deployment](#arbitrum-deployment)
5. [Testing the Application](#testing-the-application)
6. [Running Tests](#running-tests)
7. [Scripts Overview](#scripts-overview)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher)
- **Hardhat** (installed locally in this project)
- **Metamask** or another wallet if testing on Arbitrum testnet.

 ## Setup

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
   >    `"0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"`.
   >  - Remove these keys if they are unnecessary for your deployment:
   >    - `PRIVATE_KEY` for Arbitrum Deployment
   >    - `pk_localhost` for Local Deployment.

2. Deploy the contract to the local network:

   ```bash
   npm run local
   ```

   This script is designed to automate the setup of the '.env' file by checking if the local Hardhat node is running and deploying the contract to it. It will update the .env file with essential keys, including the contract address and private keys, if the file was initially empty.

   > **Note:** If any issues arise with the local script or the .env file setup, you can configure the .env file manually as described in the documentation. After setting up the environment variables manually, deploy the contract by running the deployment script directly:

   ```bash
   npm run local:deploy
   ```

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
   npm run sampoia:add      # Arbitrum Network
   ```

2. **Start Voting Process**:
   Set `VOTING_DURATION` in `.env` (e.g., `600` for 10 minutes) and run:

   ```bash
   npm run local:start      # Local Network
   npm run sampoia:start    # Arbitrum Network
   ```

3. **Cast a Vote**:
   Specify `candidateIndex` in `05-Vote.js` and execute:

   ```bash
   npm run local:vote       # Local Network
   npm run sampoia:vote     # Arbitrum Network
   ```

4. **Retrieve Voting Results**:

   ```bash
   npm run local:votes      # Local Network
   npm run sampoia:votes    # Arbitrum Network
   ```

5. **End Voting Process**:
   After the voting period ends, finalize the process:

   ```bash
   npm run local:end        # Local Network
   npm run sampoia:end      # Arbitrum Network
   ```

   > **Note:** You can check if the voting period has ended by running the time script:

   ```bash
   npm run local:time       # Local Network
   npm run sampoia:time     # Arbitrum Network
   ```

   > **Important:** When using the local network, the remaining time is only updated when a change of state occurs in the contract (e.g., casting a vote).

## Running Tests

This project includes automated tests that run on a non-persistent network. To execute all tests, use:

```bash
npm run test
```

> **Note:** The tests run using the hardhat network, which is temporary and resets with each test run. Running npx hardhat test without specifying the Hardhat network will not work as expected because it requires a non-persistent network. By default, the Hardhat network is set to be persistent to simulate a working environment similar to the Arbitrum network. Please use 'npx hardhat test --network hardhat' or 'npm run test' to ensure the tests run correctly on the intended non-persistent network.

## Scripts Overview

### Deployment

- `npm run local` / `npm run sampoia:deploy` – Deploys the contract to the local network or Arbitrum Sampoia network.

### Candidate Management

- `npm run [local|sampoia]:add` – Adds candidates to the contract.
- `npm run [local|sampoia]:remove` – Removes a candidate by index.

### Voting Process Control

- `npm run [local|sampoia]:start` – Starts the voting process.
- `npm run [local|sampoia]:end` – Ends the voting process.

### Status and Results

- `npm run [local|sampoia]:time` – Retrieves remaining time for the voting period.
  > **Note:** When using the local network, the remaining time is only updated when a change of state occurs in the contract (e.g., casting a vote).
- `npm run [local|sampoia]:status` – Checks the current voting status.
- `npm run [local|sampoia]:candidates` – Fetches candidate details.
- `npm run [local|sampoia]:votes` – Displays the vote count for each candidate.
- `npm run [local|sampoia]:indices` – Retrieves candidates with their indices.

### Voting Action

- `npm run [local|sampoia]:vote` – Casts a vote for a candidate by index.

> **Note:** Replace `[local|sampoia]` with `local` for the local network or `sampoia` for the Arbitrum network.

## Troubleshooting

- **CONTRACT_ADDRESS not set**: Ensure contract deployment is successful and `.env` is updated.
- **Insufficient funds**: Check wallet balance for gas fees on Arbitrum.
- **Local network issues**: Verify that Hardhat node is running for local deployment.

---
