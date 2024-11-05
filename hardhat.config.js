require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.11',
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      accounts: {
        count: 10, // Ensure at least 10 accounts are available for testing
      },
    },
    sampoia: {
      url: process.env.ARBITRUM_SAMPOIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    localhost: {
      url: process.env.localhost_url,
      accounts: [process.env.pk_localhost],
    },
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
