require('dotenv').config();
const hre = require("hardhat");

async function main() {
  // Ensure CONTRACT_ADDRESS is set in the environment variables
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    console.error("Error: CONTRACT_ADDRESS is not set in the .env file.");
    process.exit(1);
  }

  // Get Voting contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const votingContract = Voting.attach(contractAddress);

  console.log("Contract address:", votingContract.address);

  // Retrieve and display remaining time
  try {
    const remainingTime = await votingContract.getRemainingTime();
    displayRemainingTime(remainingTime);
  } catch (error) {
    console.error("Failed to retrieve remaining time:", error);
  }
}

// Function to display remaining time in minutes and seconds
function displayRemainingTime(remainingTime) {
  const minutes = remainingTime.div(60);
  const seconds = remainingTime.mod(60);

  if (remainingTime.eq(0)) {
    console.log("Voting has either not started or has already ended.");
  } else {
    console.log(`Remaining time: ${minutes.toString()} minutes and ${seconds.toString()} seconds`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed with error:", error);
    process.exit(1);
  });
