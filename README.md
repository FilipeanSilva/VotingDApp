
---

# Voting DApp

This project is a decentralized voting application designed specifically for the Arbitrum network but can also be tested locally using Hardhat’s local network. It leverages Solidity for smart contract logic and JavaScript scripts for deployment and interaction, allowing users to create, manage, and participate in voting processes on the blockchain.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment](#deployment)
    - [Local Deployment](#local-deployment)
    - [Arbitrum Deployment](#arbitrum-deployment)
5. [Testing the Application](#testing-the-application)
6. [Scripts Overview](#scripts-overview)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure the following are installed on your system:
- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher)
- **Hardhat** (installed locally in this project)
- **Metamask** or another wallet if testing on Arbitrum testnet.

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/voting-dapp.git
   cd voting-dapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Configuration

1. Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```

2. Add the following environment variables to `.env`:

   ```plaintext
   # Arbitrum Sampoia (Arbitrum Network Settings)
   ARBITRUM_SAMPOIA_RPC_URL="<YOUR_ARBITRUM_RPC_URL>"

   # Private key for deployment (replace this placeholder with an actual 32-byte hex private key)
   PRIVATE_KEY="0000000000000000000000000000000000000000000000000000000000000000"

   # Local Network Settings
   localhost_url="http://127.0.0.1:8545"
   # Local private key (replace this placeholder with an actual 32-byte hex private key)
   pk_localhost="1111111111111111111111111111111111111111111111111111111111111111"

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

2. Run the local deployment script:
   ```bash
   node scripts/00-Test_Deploy.js
   ```

   This script checks if the local Hardhat node is running and deploys the contract to it. It will update your `.env` file with the contract address if successful.

### Arbitrum Deployment

For deployment on the Arbitrum Sampoia network:

1. Compile the contracts:
   ```bash
   npx hardhat compile
   ```

2. Deploy the contract on Arbitrum:
   ```bash
   node scripts/00-Deploy.js
   ```

   Upon successful deployment, the `CONTRACT_ADDRESS` will automatically update in your `.env` file. If not, copy the contract address from the console output and paste it manually into the `.env` file.

## Testing the Application

After deployment, follow these steps to test the voting process:

1. **Add Candidates**:
   ```bash
   node scripts/01-AddCandidates.js
   ```

2. **Start Voting Process**:
   Set `VOTING_DURATION` in `.env` (e.g., `600` for 10 minutes) and run:
   ```bash
   node scripts/07-StartVotingProcess.js
   ```

3. **Cast a Vote**:
   Specify `candidateIndex` in `05-Vote.js` and execute:
   ```bash
   node scripts/05-Vote.js
   ```

4. **Retrieve Voting Results**:
   ```bash
   node scripts/06-GetAllVotes.js
   ```

5. **End Voting Process**:
   After the voting period ends, finalize the process:
   ```bash
   node scripts/09-EndVotingProcess.js
   ```

## Scripts Overview

| Script                          | Description                                                                                       |
|---------------------------------|---------------------------------------------------------------------------------------------------|
| **00-Deploy.js**                | Deploys contract to Arbitrum. Updates `.env` with contract address.                               |
| **00-Test_Deploy.js**           | Deploys contract to a local Hardhat network. Checks `.env` structure and network status.          |
| **01-AddCandidates.js**         | Adds candidates to the contract.                                                                 |
| **02-GetRemainingTime.js**      | Retrieves the remaining time for the voting period.                                              |
| **03-GetVotingStatus.js**       | Checks the voting status (`Not Started`, `Ongoing`, or `Ended`).                                 |
| **04-GetAllCandidates.js**      | Fetches all candidate details (names and vote counts).                                          |
| **05-Vote.js**                  | Casts a vote for a candidate by index.                                                           |
| **06-GetAllVotes.js**           | Displays all candidates and vote counts.                                                         |
| **07-StartVotingProcess.js**    | Initiates voting with a set duration.                                                            |
| **08-RemoveCandidate.js**       | Removes a candidate by index.                                                                    |
| **09-EndVotingProcess.js**      | Ends voting if duration has expired.                                                             |
| **10-GetCandidatesWithIndices.js** | Retrieves candidates with their indices for reference.                                      |

## Troubleshooting

- **CONTRACT_ADDRESS not set**: Ensure contract deployment is successful and `.env` is updated.
- **Insufficient funds**: Check wallet balance for gas fees on Arbitrum.
- **Local network issues**: Verify that Hardhat node is running for local deployment.

--- 