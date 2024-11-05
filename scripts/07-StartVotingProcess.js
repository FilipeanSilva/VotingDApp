async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; // Ensure this is set in your .env file
  const votingDurationInSeconds = 600; //Seconds

  // Get contract instance
  const Voting = await ethers.getContractFactory('Voting');
  const votingContract = Voting.attach(contractAddress);

  console.log("Starting the voting process with a duration of", votingDurationInSeconds, "seconds");

  // Call startVotingProcess
  const tx = await votingContract.startVotingProcess(votingDurationInSeconds);
  await tx.wait(); // Wait for the transaction to be mined

  console.log("Voting process started successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
