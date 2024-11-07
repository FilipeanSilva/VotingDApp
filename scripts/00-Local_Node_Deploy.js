const fs = require('fs');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const axios = require('axios');

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
  try {
    await axios.post("http://127.0.0.1:8545", {
      jsonrpc: "2.0",
      id: 1,
      method: "web3_clientVersion",
      params: [],
    });
    return true;
  } catch (error) {
    return false;
  }
};

const ensureEnvStructure = () => {
  const envPath = ".env";

  if (!fs.existsSync(envPath)) {
    // Create the .env file if it doesn't exist with default content
    fs.writeFileSync(envPath, defaultEnvContent.trim());
    console.log(".env file created with default structure.");
  } else {
    // Check and add missing sections or keys to the existing .env file
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");

    const updatedLines = [];
    let arbitrumSection = false;
    let localNetworkSection = false;
    let contractAddressSection = false;

    lines.forEach((line) => {
      if (line.startsWith("# Arbitrum Sampoia")) arbitrumSection = true;
      if (line.startsWith("# Local Network Settings")) localNetworkSection = true;
      if (line.startsWith("# Contract Address")) contractAddressSection = true;
      updatedLines.push(line);
    });

    // Add missing sections with default values
    if (!arbitrumSection) {
      updatedLines.push(
        "\n# Arbitrum Sampoia",
        'ARBITRUM_SAMPOIA_RPC_URL="https://arb-sepolia.g.alchemy.com/v2/your-alchemy-key"',
        'PRIVATE_KEY=""'
      );
    }

    if (!localNetworkSection) {
      updatedLines.push(
        "\n# Local Network Settings",
        'localhost_url="http://127.0.0.1:8545"',
        'pk_localhost="0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"'
      );
    }

    if (!contractAddressSection) {
      updatedLines.push("\n# Contract Address", 'CONTRACT_ADDRESS=""');
    }

    fs.writeFileSync(envPath, updatedLines.join("\n").trim());
    console.log(".env file updated with required structure.");
  }
};

// Run the deployment script
const runDeployment = () => {
  exec("npx hardhat run --network localhost scripts/00-Deploy.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running deployment script: ${error.message}`);
      return;
    }
    console.log(stdout);
  });
};

// Execute the process
(async () => {
  const nodeRunning = await isNodeRunning();
  if (nodeRunning) {
    console.log("Hardhat node is already running.");
    ensureEnvStructure();
    runDeployment();
  } else {
    console.log("Please start the Hardhat node in another terminal with: npx hardhat node");
  }
})();