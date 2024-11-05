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

  try {
    const allCandidates = await votingContract.getAllCandidates();
    displayCandidates(allCandidates);
  } catch (error) {
    console.error('Failed to retrieve candidates:', error);
  }
}

function displayCandidates(candidates) {
  if (!candidates || candidates.length === 0) {
    console.log('No candidates found.');
    return;
  }

  console.log('Candidates and Votes:');
  console.log('------------------------');
  candidates.forEach((candidate, index) => {
    console.log(
      `Candidate: ${candidate.name} - ${candidate.voteCount} votes`
    );
    console.log('------------------------');
  });

  console.log('Total candidates:', candidates.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
