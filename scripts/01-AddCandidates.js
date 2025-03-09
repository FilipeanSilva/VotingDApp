require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error('Error: CONTRACT_ADDRESS is not set in the .env file.');
    process.exit(1);
  }

  // Read candidates from environment variable
  const candidates = process.env.CANDIDATES ? process.env.CANDIDATES.split(',') : [];
  if (candidates.length === 0) {
    console.error('Error: No candidates provided. Set the CANDIDATES environment variable.');
    process.exit(1);
  }

  console.log('Preparing to add candidates:', candidates);

  const Voting = await hre.ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  // Add candidates and wait for confirmation
  try {
    await addCandidates(votingContract, candidates);
    console.log('Candidates added successfully!');
  } catch (error) {
    console.error(
      `Failed to add candidates:\nReason${error.reason}\n\nDetailed error:\n`,
      error
    );
  }
}

// Function to add candidates to the voting contract
async function addCandidates(contract, candidates) {
  console.log('Submitting transaction to add candidates...');
  const tx = await contract.addCandidates(candidates);
  await tx.wait();
  console.log('Transaction mined. Candidates were successfully added.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
