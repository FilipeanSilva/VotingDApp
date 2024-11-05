require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('Error: CONTRACT_ADDRESS is not set in the .env file.');
    process.exit(1);
  }

  // Set voting duration, default to 600 seconds if not set in .env
  const votingDurationInSeconds = process.env.VOTING_DURATION || 600;
  console.log(
    'Starting the voting process with a duration of',
    votingDurationInSeconds,
    'seconds'
  );

  // Get Voting contract instance
  const Voting = await hre.ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  // Start the voting process
  try {
    await startVotingProcess(votingContract, votingDurationInSeconds);
    console.log('Voting process started successfully!');
  } catch (error) {
    console.error('Failed to start the voting process:', error);
  }
}

// Function to start the voting process
async function startVotingProcess(contract, duration) {
  console.log('Sending transaction to start the voting process...');
  const tx = await contract.startVotingProcess(duration);
  await tx.wait(); // Wait for the transaction to be mined
  console.log('Transaction mined: Voting process has started.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
