//! SOMETIMES USING A FAKE NETWORK THE TIME WILL NOT UPDATE UNTIL A NEW TRANSACTION THAT MODIFIES STATE IS PLACED
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const candidateIndex = 3;

  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Cast the vote
  await Voting_.vote(candidateIndex);
  console.log(
    `Vote cast successfully for candidate at index ${candidateIndex}`
  );

  // Retrieve and display updated candidate information
  const [name, voteCount] = await Voting_.getCandidate(candidateIndex);
  console.log(`Candidate: ${name}`);
  console.log(`Updated Votes: ${voteCount.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
