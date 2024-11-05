//! SOMETIMES USING A FAKE NETWORK THE TIME WILL NOT UPDATE UNTIL A NEW TRANSACTION THAT MODIFIES STATE IS PLACED
require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS is not set in the .env file.");
    process.exit(1);
  }

  // Set the candidate index to vote for
  const candidateIndex = 2;

  // Get Voting contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingContract = Voting.attach(contractAddress);

  console.log("Contract address:", votingContract.address);

  try {
    await castVote(votingContract, candidateIndex);
    await displayCandidateInfo(votingContract, candidateIndex);
  } catch (error) {
    console.error("Error during voting or retrieving candidate info:", error);
  }
}

// Function to cast a vote for a specific candidate
async function castVote(contract, candidateIndex) {
  console.log(`Casting vote for candidate at index ${candidateIndex}...`);
  const tx = await contract.vote(candidateIndex);
  await tx.wait(); // Wait for the transaction to be mined
  console.log(`Vote cast successfully for candidate at index ${candidateIndex}`);
}

// Function to retrieve and display candidate information
async function displayCandidateInfo(contract, candidateIndex) {
  console.log("Retrieving updated candidate information...");
  const [name, voteCount] = await contract.getCandidate(candidateIndex);
  console.log(`Candidate: ${name}`);
  console.log(`Updated Votes: ${voteCount.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed with error:", error);
    process.exit(1);
  });