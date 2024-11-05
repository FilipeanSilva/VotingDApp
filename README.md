# Voting DApp (Arbitrum Test Project)

This project is a decentralized voting application built with Solidity, Hardhat, and deployed on the Arbitrum Sepolia network. This Voting DApp allows transparent voting on candidates in a secure, decentralized manner on the Arbitrum Layer 2 blockchain.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Arbitrum Sepolia Network Setup](#arbitrum-sepolia-network-setup)
- [Usage](#usage)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment on Arbitrum Sepolia Testnet](#deployment-on-arbitrum-sepolia-testnet)
- [Contract Functions](#contract-functions)
- [License](#license)

## Features

- **Add Candidates**: Allows only the contract owner to add new candidates.
- **Start Voting**: The owner can start the voting process for a specified duration.
- **Vote**: Users can cast a vote for a candidate.
- **End Voting**: The owner or any user can end the voting process when the voting period has elapsed.
- **Get Results**: Retrieve candidate names, votes, and indices.

## Requirements

- Node.js and npm (or Yarn)
- Hardhat
- Ethereum wallet (e.g., MetaMask)
- `.env` file with:
  ```plaintext
  CONTRACT_ADDRESS=<Your_Contract_Address>
  VOTING_DURATION=<Voting_Duration_in_Seconds>
  CANDIDATE_INDEX=<Default_Candidate_Index>
  ```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd VotingDApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Compile the smart contract:
   ```bash
   npx hardhat compile
   ```

4. Configure environment variables:
   - Create a `.env` file in the project root and add the following:
     ```plaintext
     CONTRACT_ADDRESS=<Your_Contract_Address>
     VOTING_DURATION=600
     CANDIDATE_INDEX=0
     ```

## Arbitrum Sepolia Network Setup

To deploy and interact with this project on the Arbitrum Sepolia network, you’ll need to set up the Arbitrum Sepolia testnet in MetaMask and obtain testnet tokens.

### 1. Set Up Arbitrum Sepolia Testnet in MetaMask

1. Open MetaMask and go to **Settings > Networks > Add Network**.
2. Add the Arbitrum Sepolia testnet configuration:
   - **Network Name**: Arbitrum Sepolia Testnet
   - **New RPC URL**: `https://sepolia-rollup.arbitrum.io/rpc`
   - **Chain ID**: `421614`
   - **Currency Symbol**: ETH
   - **Block Explorer URL**: [https://sepolia.arbiscan.io/](https://sepolia.arbiscan.io/)

### 2. Get Testnet ETH (Faucet)

You’ll need some test ETH to deploy and interact with your contract on Arbitrum Sepolia. You can get testnet ETH from the following faucets:

- [Arbitrum Sepolia Faucet](https://bridge.arbitrum.io/)
- [Alchemy Sepolia Faucet](https://goerlifaucet.com/) (requires a Twitter account)
- [Paradigm Faucet](https://faucet.paradigm.xyz/) (supports multiple networks)

### 3. Fund Your Wallet

Once you’ve obtained testnet ETH, fund your MetaMask wallet on the Arbitrum Sepolia network.

## Usage

### Starting a Local Node (for Local Testing)

To deploy and interact with the contract on a local network, start a local Hardhat node:

```bash
npx hardhat node
```

### Running Scripts

Once your `.env` is configured with the Arbitrum Sepolia testnet contract address and other necessary values, you can run the scripts:

- **Add Candidates**:
  ```bash
  npx hardhat run scripts/addCandidates.js --network sampoia
  ```
  This script adds an array of candidates to the voting contract.

- **Start Voting**:
  ```bash
  npx hardhat run scripts/startVotingProcess.js --network sampoia
  ```
  Starts the voting process with the configured duration.

- **Vote for a Candidate**:
  ```bash
  npx hardhat run scripts/vote.js --network sampoia
  ```
  Casts a vote for a specified candidate index.

- **End Voting**:
  ```bash
  npx hardhat run scripts/endVoting.js --network sampoia
  ```
  Ends the voting process, emitting the `VotingEnded` event.

- **Get Voting Status**:
  ```bash
  npx hardhat run scripts/getVotingStatus.js --network sampoia
  ```
  Retrieves the current status of the voting process.

## Scripts

Each script performs a specific function related to the voting process:

- `deployVoting.js`: Deploys the Voting contract.
- `addCandidates.js`: Adds candidates to the voting contract.
- `startVotingProcess.js`: Starts the voting process.
- `vote.js`: Casts a vote for a candidate.
- `endVoting.js`: Ends the voting process.
- `getVotingStatus.js`: Checks if voting is ongoing, not started, or ended.
- `getRemainingTime.js`: Displays the remaining voting time.
- `getCandidatesWithIndices.js`: Retrieves all candidate names with their respective indices.

## Testing

To test the Voting contract, you can create a test file in the `test` folder:

1. **Run Tests**:
   ```bash
   npx hardhat test
   ```

   Tests will verify the functionalities of adding candidates, starting/ending voting, and voting constraints.

## Deployment on Arbitrum Sepolia Testnet

To deploy the contract on the Arbitrum Sepolia test network, configure the network in `hardhat.config.js` and use the appropriate network flag:

1. **Set Up Arbitrum Sepolia in `hardhat.config.js`**:
   
   ```javascript
   networks: {
     sampoia: {
       url: "https://sepolia-rollup.arbitrum.io/rpc",
       accounts: [process.env.PRIVATE_KEY],
     },
   }
   ```

   Make sure to add your wallet’s private key to your `.env` file as `PRIVATE_KEY`:
   ```plaintext
   PRIVATE_KEY=<Your_Private_Key>
   ```

2. **Deploy on Arbitrum Sepolia**:
   ```bash
   npx hardhat run scripts/deployVoting.js --network sampoia
   ```

3. Update `CONTRACT_ADDRESS` in `.env` with the deployed contract address.

## Contract Functions

### Public Functions

- `addCandidates(string[] memory _names)`: Adds multiple candidates (only owner).
- `excludeCandidate(uint256 _candidateIndex)`: Excludes a candidate by index (only owner).
- `startVotingProcess(uint256 _durationInSeconds)`: Starts the voting for a specific duration (only owner).
- `vote(uint256 _candidateIndex)`: Allows users to cast their votes.
- `endVoting()`: Ends the voting process if the time has expired.
- `getCandidatesWithIndices()`: Retrieves all candidate names and their respective indices.
- `getVotingStatus()`: Returns the voting status (Not Started, Ongoing, Ended).
- `getRemainingTime()`: Returns the remaining voting time in seconds.

### Events

- `VotingStarted(uint256 start, uint256 end)`: Emitted when voting starts.
- `VotingEnded(uint256 endTime)`: Emitted when voting ends.
- `CandidateAdded(string name)`: Emitted when a candidate is added.
- `VoteCast(address voter, uint256 candidateIndex)`: Emitted when a vote is cast.

## License

This project is licensed under the MIT License.