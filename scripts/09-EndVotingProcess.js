require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('Error: CONTRACT_ADDRESS is not set in the .env file.');
    process.exit(1);
  }

  const Voting = await hre.ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log('Contract address:', votingContract.address);

  // Check if the voting period has ended
  try {
    const votingEnded = await checkIfVotingEnded(votingContract);
    if (!votingEnded) {
      console.log(
        'Voting is still ongoing. Please wait until the voting period has ended.'
      );
      return;
    }

    // Call endVoting if the voting period has ended
    await endVoting(votingContract);
    console.log(
      'Voting has ended successfully, and the VotingEnded event has been emitted.'
    );
  } catch (error) {
    console.error('Error during voting end process:', error);
  }
}

// Function to check if voting has ended
async function checkIfVotingEnded(contract) {
  const votingEnd = await contract.votingEnd();
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= votingEnd;
}

// Function to call endVoting on the contract
async function endVoting(contract) {
  console.log('Sending transaction to end the voting process...');
  const tx = await contract.endVoting();
  await tx.wait(); // Wait for the transaction to be mined
  console.log('Transaction mined: Voting process has ended.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
