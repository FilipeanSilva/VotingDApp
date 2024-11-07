const fs = require('fs');
require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.11',
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      accounts: {
        count: 10,
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