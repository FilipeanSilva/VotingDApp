// scripts/01-GetRemainingTime.js
require('dotenv').config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const Voting = await ethers.getContractFactory('Voting');
  const Voting_ = Voting.attach(contractAddress);

  console.log('Contract address:', Voting_.address);

  // Retrieve and display remaining time
  const remainingTime = await Voting_.getRemainingTime();
  const minutes = remainingTime.div(60);
  const seconds = remainingTime.mod(60);

  if (remainingTime.eq(0)) {
    console.log('Voting has either not started or has already ended.');
  } else {
    console.log(
      `Remaining time: ${minutes.toString()} minutes and ${seconds.toString()} seconds`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
