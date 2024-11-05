// scripts/01-Vote.js
require('dotenv').config(); // Load environment variables from .env

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  // Get contract instance
  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Retrieve and display all votes of candidates
  const allVotes = await Voting_.getAllCandidates();

  let totalCandidates= 0;
  // Display votes for each candidate
  allVotes.forEach((candidate, index) => {
    console.log(`Candidate ${index + 1}: ${candidate.name}`);
    console.log('------------------------');
    totalCandidates++
  });

  console.log('Total candidates:', totalCandidates);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
