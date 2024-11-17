const fs = require('fs').promises;
const dotenv = require('dotenv');
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');

dotenv.config(); // Load existing .env configuration

const defaultEnvContent = `
# Arbitrum Sampoia
ARBITRUM_SAMPOIA_RPC_URL=""
PRIVATE_KEY=""

# Local Network Settings
localhost_url=""
pk_localhost=""

# Contract Address
CONTRACT_ADDRESS=""
`;

// Function to check if the Hardhat node JSON-RPC endpoint is responding
const isNodeRunning = async () => {
  dotenv.config(); // Reload existing .env configuration

  const networkUrl = process.env.localhost_url;
  const networkName = 'localhost'; // Change this as needed or fetch dynamically if required

  try {
    await axios.post(networkUrl, {
      jsonrpc: '2.0',
      id: 1,
      method: 'web3_clientVersion',
      params: [],
    });
    console.log(
      `Network '${networkName}' with url '${networkUrl}' is running.`
    );
    return true;
  } catch (error) {
    console.log(`${networkName} network (${networkUrl}) is not responding.`);
    return false;
  }
};

const ensureEnvStructure = async () => {
  const envPath = path.resolve('.env');

  try {
    // Check if the .env file exists
    await fs.access(envPath);
    // Read the existing .env file content
    const content = await fs.readFile(envPath, 'utf-8');
    const lines = content.split('\n');

    const requiredSections = {
      '# Arbitrum Sampoia': [
        'ARBITRUM_SAMPOIA_RPC_URL="https://sepolia-rollup.arbitrum.io/rpc"',
        'PRIVATE_KEY=""',
      ],
      '# Local Network Settings': [
        'localhost_url="http://127.0.0.1:8545" # Hardhat local Ethereum Network',
        'pk_localhost="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"',
      ],
      '# Contract Address': ['CONTRACT_ADDRESS=""'],
    };

    let updatedLines = [...lines];
    let needsUpdate = false;

    for (const [section, keys] of Object.entries(requiredSections)) {
      const sectionExists = updatedLines.some(
        (line) => line.trim() === section
      );
      let sectionIndex = updatedLines.findIndex(
        (line) => line.trim() === section
      );

      keys.forEach((key) => {
        const keyName = key.split('=')[0];
        const keyLineIndex = updatedLines.findIndex((line) =>
          line.startsWith(keyName)
        );

        if (keyLineIndex === -1) {
          // Key does not exist at all, so add it
          needsUpdate = true;
          if (sectionExists && sectionIndex !== -1) {
            updatedLines.splice(sectionIndex + 1, 0, key);
            sectionIndex++;
          } else if (!sectionExists) {
            updatedLines.push(`\n${section}`, key);
          }
        }
      });

      if (!sectionExists && keys.length > 0) {
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await fs.writeFile(envPath, updatedLines.join('\n').trim());
      console.log('.env file updated with required structure.');

      // Reload the environment variables after updating the .env file
      dotenv.config();
      console.log('Environment variables reloaded.');
    } else {
      console.log('.env file already contains all required keys.');
    }
  } catch (error) {
    // Create the .env file if it doesn't exist with default content
    await fs.writeFile(envPath, defaultEnvContent.trim());
    console.log('.env file created with default structure.');

    // Reload the environment variables after creating the .env file
    dotenv.config();
    console.log('Environment variables reloaded.');
  }
};

// Run the deployment script
const runDeployment = () => {
  dotenv.config();
  exec(
    'npx hardhat run --network localhost scripts/00-Deploy.js',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running deployment script: ${error.message}`);
        return;
      }
      console.log(stdout);
    }
  );
};

// Execute the process
(async () => {
  await ensureEnvStructure();
  const nodeRunning = await isNodeRunning();
  if (nodeRunning) {
    runDeployment();
  } else {
    console.log(
      'Network not responding.\nPlease start a network p.e. Hardhat node in another terminal with: npx hardhat node'
    );
  }
})();
