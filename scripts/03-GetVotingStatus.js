// scripts/01-Vote.js
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const candidateIndex = 0;

  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Retrieve and display time left
  const votingStatus = await Voting_.getVotingStatus();
  console.log('Voting Status: ', votingStatus === true ? 'On going' : 'Ended');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
