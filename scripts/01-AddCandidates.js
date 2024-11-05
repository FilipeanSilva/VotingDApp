require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS is not set in the .env file.");
    process.exit(1);
  }

  const candidateNames = ["Alice", "Bob", "Charlie", "Dave"];
  console.log("Preparing to add candidates:", candidateNames);

  const Voting = await hre.ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  // Add candidates and wait for confirmation
  try {
    await addCandidates(votingContract, candidateNames);
    console.log("Candidates added successfully!");
  } catch (error) {
    console.error("Failed to add candidates:", error);
  }
}

// Function to add candidates to the voting contract
async function addCandidates(contract, candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Candidate names must be provided as a non-empty array.");
  }

  console.log("Submitting transaction to add candidates...");
  const tx = await contract.addCandidates(candidates);
  await tx.wait(); // Wait for the transaction to be mined
  console.log("Transaction mined. Candidates were successfully added.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed with error:", error);
    process.exit(1);
  });
