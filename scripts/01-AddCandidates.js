async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; // Ensure this is set in your .env file

  // Define an array of candidate names to add
  const candidateNames = ["Alice", "Bob", "Charlie", "Dave"];

  // Get contract instance
  const Voting = await ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log("Adding candidates:", candidateNames);

  // Call addCandidates
  const tx = await votingContract.addCandidates(candidateNames);
  await tx.wait(); // Wait for the transaction to be mined

  console.log("Candidates added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });