require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  // Load the contract address from environment variables
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Get the contract instance
  const Voting = await ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log('Contract address:', votingContract.address);

/*   // Get the current block timestamp to check if voting has ended
  const votingEnd = await votingContract.votingEnd();
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime < votingEnd) {
    console.log(
      'Voting is still ongoing. Please wait until the voting period has ended.'
    );
    return;
  } */

  // Call the endVoting function
  try {
    const tx = await votingContract.endVoting();
    await tx.wait(); // Wait for the transaction to be mined
    console.log(
      'Voting has ended successfully, and the VotingEnded event has been emitted.'
    );
  } catch (error) {
    console.error('Failed to end voting:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
