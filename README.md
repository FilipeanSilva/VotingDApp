---

# Voting DApp

This project is a decentralized voting application built with Solidity for smart contract logic and JavaScript scripts for deployment and interaction. The DApp allows users to create, manage, and participate in voting processes on the blockchain.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Environment Configuration](#environment-configuration)
4. [Deployment](#deployment)
5. [Testing the Application](#testing-the-application)
    - [Add Candidates](#add-candidates)
    - [Start Voting Process](#start-voting-process)
    - [Cast a Vote](#cast-a-vote)
    - [Retrieve Voting Results](#retrieve-voting-results)
    - [End Voting Process](#end-voting-process)
6. [Scripts Overview](#scripts-overview)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (version 16.x or higher)
- **npm** (version 7.x or higher)
- **Hardhat** (installed locally in this project)
- **Metamask** or another wallet if testing on a testnet.

## Setup

1. Clone this repository:
   ```bash
   git clone https://gitlab.inf.unibe.ch/crypto-public/sem-crypto-hs24-arb/-/tree/main/dapp2
   cd voting-dapp2
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
   # RPC URL for Arbitrum Sampoia or other network
   ARBITRUM_SAMPOIA_RPC_URL="<YOUR_ARBITRUM_RPC_URL>"

   # Your private key for deployment
   PRIVATE_KEY="<YOUR_PRIVATE_KEY>"

   # Localhost URL and key (optional)
   localhost_url="http://127.0.0.1:8545"
   pk_localhost="<LOCAL_PRIVATE_KEY>"

   # Contract Address (leave blank for deployment)
   CONTRACT_ADDRESS=""
   ```

   > **Note:** Ensure your private key is kept secure and do not commit it to version control.

## Deployment

1. Compile the contracts:
   ```bash
   npx hardhat compile
   ```

2. Deploy the contract:
   ```bash
   node scripts/00-Deploy.js
   ```

   Upon successful deployment, the `CONTRACT_ADDRESS` will automatically update in your `.env` file. If not, copy the contract address from the console output and paste it manually into the `.env` file.

## Testing the Application

After deployment, follow these steps to test the voting process:

### 1. Add Candidates

To add candidates to the voting contract, run:

```bash
node scripts/01-AddCandidates.js
```

This script will add a predefined list of candidates. You can customize the list inside `01-AddCandidates.js`. The console will confirm successful addition.

### 2. Start Voting Process

Set the voting duration in seconds in your `.env` file:

```plaintext
VOTING_DURATION="600"  # Default is 600 seconds (10 minutes)
```

Then start the voting process:

```bash
node scripts/07-StartVotingProcess.js
```

The console will display the voting start time and the duration. 

### 3. Cast a Vote

To cast a vote for a specific candidate, set the candidate index in `05-Vote.js`:

```javascript
const candidateIndex = 2; // Replace '2' with your desired candidate index
```

Run the script to vote:

```bash
node scripts/05-Vote.js
```

The console will display the updated vote count for the chosen candidate.

### 4. Retrieve Voting Results

You can retrieve all candidates and their current vote counts using:

```bash
node scripts/06-GetAllVotes.js
```

The console output will display each candidate's name and the number of votes they have received.

### 5. End Voting Process

After the voting duration has elapsed, end the voting process by running:

```bash
node scripts/09-EndVotingProcess.js
```

If the voting period has ended, this script will finalize the process and emit the `VotingEnded` event.

## Scripts Overview

Below is a brief overview of each script:

| Script                          | Description                                                                                       |
|---------------------------------|---------------------------------------------------------------------------------------------------|
| **00-Deploy.js**                | Compiles and deploys the contract. Updates `.env` with the contract address.                     |
| **01-AddCandidates.js**         | Adds a list of candidates to the voting contract.                                                |
| **02-GetRemainingTime.js**      | Retrieves the remaining time for the voting period.                                              |
| **03-GetVotingStatus.js**       | Checks the current voting status (`Not Started`, `Ongoing`, or `Ended`).                         |
| **04-GetAllCandidates.js**      | Fetches all candidate details (names and vote counts).                                          |
| **05-Vote.js**                  | Allows a user to vote for a candidate by index.                                                  |
| **06-GetAllVotes.js**           | Displays all candidates and their vote counts.                                                  |
| **07-StartVotingProcess.js**    | Starts the voting process with a set duration.                                                  |
| **08-RemoveCandidate.js**       | Excludes a candidate from the list based on index.                                              |
| **09-EndVotingProcess.js**      | Ends the voting process if the duration has expired.                                            |
| **10-GetCandidatesWithIndices.js** | Retrieves candidates with their indices, helpful for selecting candidates to vote for. |

## Troubleshooting

- **Error: CONTRACT_ADDRESS is not set**: Ensure the contract has been deployed and that the `.env` file contains the correct address.
- **Insufficient funds**: Make sure the wallet connected to the private key has enough ETH on the network for gas fees.
- **Network issues**: Verify the RPC URL and ensure the network is available.

---