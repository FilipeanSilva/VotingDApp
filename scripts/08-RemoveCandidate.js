async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; 
  const candidateIndex = 0;

  // Get contract instance
  const Voting = await ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log(`Excluding candidate at index ${candidateIndex}...`);

  // Call excludeCandidate
  const tx = await votingContract.excludeCandidate(candidateIndex);
  await tx.wait(); // Wait for the transaction to be mined

  console.log(`Candidate at index ${candidateIndex} excluded successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
