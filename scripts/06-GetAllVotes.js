require('dotenv').config();
const hre = require('hardhat');

async function main() {
  // Ensure CONTRACT_ADDRESS is set in the environment variables
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('Error: CONTRACT_ADDRESS is not set in the .env file.');
    process.exit(1);
  }

  // Get Voting contract instance
  const Voting = await hre.ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log('Contract address:', votingContract.address);

  // Retrieve and display all candidates and their votes
  try {
    const allCandidates = await votingContract.getAllCandidates();
    displayCandidates(allCandidates);
  } catch (error) {
    console.error('Failed to retrieve candidates:', error);
  }
}

// Function to display candidates and their vote counts
function displayCandidates(candidates) {
  if (!candidates || candidates.length === 0) {
    console.log('No candidates found.');
    return;
  }

  console.log('Candidates and Vote Counts:');
  console.log('---------------------------------------');
  candidates.forEach((candidate, index) => {
    console.log(
      `Index: ${index}; Name: ${
        candidate.name
      }; Votes: ${candidate.voteCount.toString()}`
    );
  });
  console.log('---------------------------------------');
  console.log('Total candidates:', candidates.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
