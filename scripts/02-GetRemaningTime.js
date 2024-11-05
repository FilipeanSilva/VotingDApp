// scripts/01-Vote.js
async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const candidateIndex = 0;

  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Retrieve and display time left
  const remainingTime = await Voting_.getRemainingTime();
  const minutes = remainingTime.div(60);
  const seconds = remainingTime.mod(60);

  console.log(
    `Remaining time: ${minutes.toString()} minutes and ${seconds.toString()} seconds`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
