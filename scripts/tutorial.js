const { network } = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  await deploy('Voting', {
    from: deployer,
    args: ['Mark', 'Mike', 'Henry', 'Rock'],
    log: true,
  });
};
