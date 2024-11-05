async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const candidateIndex = 0;

  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Retrieve and display voting status
  const votingStatus = await Voting_.getVotingStatus();

  // Interpret the status
  let statusMessage;
  switch (votingStatus) {
    case 0:
      statusMessage = 'Not started';
      break;
    case 1:
      statusMessage = 'Ongoing';
      break;
    case 2:
      statusMessage = 'Ended';
      break;
    default:
      statusMessage = 'Unknown status';
  }

  console.log('Voting Status:', statusMessage);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
