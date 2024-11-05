const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const Voting = await ethers.getContractFactory('Voting');

  const Voting_ = await Voting.deploy(['Mark', 'Mike', 'Henry', 'Rock'], 10);
  await Voting_.deployTransaction.wait(1);

  console.log('Contract address:', Voting_.address);

  //! REMOVE THIS IN DEPLOIMENT FASE
  const envPath = path.resolve('.env');
  const envContents = fs.readFileSync(envPath, 'utf8');
  const newContractAddress = `CONTRACT_ADDRESS=${Voting_.address}`;

  // Update CONTRACT_ADDRESS var in .env or add it if it doesn’t exist
  const updatedEnvContents = envContents.includes('CONTRACT_ADDRESS=')
    ? envContents.replace(/CONTRACT_ADDRESS=.*/, newContractAddress)
    : `${envContents}\n${newContractAddress}`;

  fs.writeFileSync(envPath, updatedEnvContents);
  //!
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
