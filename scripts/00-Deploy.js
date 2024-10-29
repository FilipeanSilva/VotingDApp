async function main() {
  const Voting = await ethers.getContractFactory('Voting');

  // Start deployment, returning a promise that resolves to a contract object
  const Voting_ = await Voting.deploy(['Mark', 'Mike', 'Henry', 'Rock'], 90);
  await Voting_.deployTransaction.wait(1);

  console.log('Contract address:', Voting_.address);

  await Voting_.vote(0);

  const getVotes2 = await Voting_.getAllVotesOfCandiates();
  console.log('Votes:', getVotes2[0].voteCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
