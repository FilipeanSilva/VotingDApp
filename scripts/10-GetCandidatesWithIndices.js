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

  // Retrieve and display candidate names and indices
  try {
    const [names, indices] = await votingContract.getCandidatesWithIndices();
    console.log('Candidates and their respective indices:');
    indices.forEach((index, i) => {
      console.log(`Index: ${index}; Name: ${names[i]}`);
    });
  } catch (error) {
    console.error('Failed to retrieve candidates with indices:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
