require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS is not set in the .env file.");
    process.exit(1);
  }

  // Set candidate index, default to 0 if not set in .env
  const candidateIndex = process.env.CANDIDATE_INDEX || 2;
  console.log(`Excluding candidate at index ${candidateIndex}...`);

  // Get Voting contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingContract = Voting.attach(contractAddress);

  try {
    await excludeCandidate(votingContract, candidateIndex);
    console.log(`Candidate at index ${candidateIndex} excluded successfully!`);
  } catch (error) {
    console.error("Failed to exclude candidate:", error);
  }
}

async function excludeCandidate(contract, index) {
  console.log("Sending transaction to exclude candidate...");
  const tx = await contract.excludeCandidate(index);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("Transaction mined: Candidate has been excluded.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed with error:", error);
    process.exit(1);
  });
