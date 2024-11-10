const fs = require('fs');
const path = require('path');
const hre = require('hardhat');
require('dotenv').config();

async function main() {
  // Compile the contracts
  console.log('Compiling contracts...');
  await hre.run('compile');

  // Deploy the Voting contract
  console.log('Deploying Voting contract...');
  const Voting = await hre.ethers.getContractFactory('Voting');
  try {
    const votingContract = await Voting.deploy();
    await votingContract.deployed();

    console.log(
      `Voting contract deployed successfully.\n` +
        `Network Details:\n` +
        `- Network Name: ${hre.network.name}\n` +
        `- Network URL: ${hre.network.config.url}\n` +
        `- Contract Address: ${votingContract.address}`
    );

    // Update the .env file with the new contract address
    updateEnvFile('CONTRACT_ADDRESS', votingContract.address);
  } catch (e) {
    if (e.code == 'NETWORK_ERROR') {
      console.error(
        `-- Failed to deploy Voting contract due to network error. Verify .env file or/and network setup.--\n
        Network URL: ${hre.network.config?.url || 'Not available'}
        Network Name: ${hre.network.config?.name || 'Not available'} \n
        ${e.message}`
      );
    }
    console.error('Failed to deploy Voting contract:', e);
    process.exit(1);
  }
}

// Function to update or add a key-value pair in the .env file
function updateEnvFile(key, value) {
  const envPath = path.resolve('.env');

  try {
    // Read existing .env contents or create a new string if file does not exist
    const envContents = fs.existsSync(envPath)
      ? fs.readFileSync(envPath, 'utf8')
      : '';
    const newLine = `${key}=${value}`;

    // Update or append the key-value pair
    const updatedEnvContents = envContents.includes(`${key}=`)
      ? envContents.replace(new RegExp(`${key}=.*`), newLine)
      : `${envContents}\n${newLine}`;

    // Write changes to .env file
    fs.writeFileSync(envPath, updatedEnvContents.trim()); // Trim to avoid leading newlines
    console.log(`Updated ${key} in .env file`);
  } catch (error) {
    console.error(`Failed to update .env file:`, error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
