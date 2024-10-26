require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.11',
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    sampoia: {
      url: process.env.ARBITRUM_SAMPOIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    localhost: {
      url: process.env.localhost_url,
      accounts: [process.env.pk_localhost],
    },
  },
};
