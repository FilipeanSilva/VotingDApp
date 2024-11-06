const fs = require('fs');
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

// Define the required keys and their default values
const requiredEnvKeys = {
  ARBITRUM_SAMPOIA_RPC_URL: '',
  PRIVATE_KEY: '',
  localhost_url: '',
  pk_localhost: '',
  CONTRACT_ADDRESS: '',
};

// Function to ensure all required keys are present in .env
const ensureEnvKeys = () => {
  const envPath = '.env';
  let envData = '';

  if (fs.existsSync(envPath)) {
    envData = fs.readFileSync(envPath, 'utf-8');
  }

  const missingKeys = Object.entries(requiredEnvKeys).filter(([key]) => !envData.includes(key));

  if (missingKeys.length > 0) {
    const newEntries = missingKeys
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');

    fs.appendFileSync(envPath, `\n${newEntries}\n`);
    console.log(`Added missing keys to .env:\n${newEntries}`);
  }
};

// Ensure all keys in .env file
ensureEnvKeys();

module.exports = {
  solidity: '0.8.11',
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      accounts: {
        count: 10, // Ensure at least 10 accounts are available for testing
      },
    },
    localhost: {
      url: process.env.localhost_url || 'http://127.0.0.1:8545',
      accounts: [process.env.pk_localhost].filter(Boolean),
    },
    // Conditionally add the sampoia network only if required environment variables are set
    ...(process.env.ARBITRUM_SAMPOIA_RPC_URL && process.env.PRIVATE_KEY
      ? {
          sampoia: {
            url: process.env.ARBITRUM_SAMPOIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
          },
        }
      : {}),
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
