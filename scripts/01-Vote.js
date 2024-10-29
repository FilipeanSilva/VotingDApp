// scripts/01-Vote.js
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const candidateIndex = 0;

  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  await Voting_.vote(candidateIndex);

  // Retrieve and display votes
  const getVotes2 = await Voting_.getAllVotesOfCandiates();
  console.log('Votes:', getVotes2[0].voteCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
