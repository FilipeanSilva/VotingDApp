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

// Function to start the Hardhat node as a background process
const startHardhatNode = () => {
  return new Promise((resolve, reject) => {
    const hardhatProcess = exec('npx hardhat node', { detached: true });

    hardhatProcess.stdout.on('data', (data) => {
      if (data.includes('HTTP and WebSocket JSON-RPC endpoints')) {
        console.log('Hardhat node started successfully.');
        resolve(hardhatProcess); // Resolve with the process reference
      }
    });

    hardhatProcess.stderr.on('data', (err) => console.error(err));
    hardhatProcess.on('error', (error) => reject(error));
  });
};

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

// Function to update .env file with Hardhat node URL and private key
const updateEnvFile = () => {
  const defaultUrl = "http://127.0.0.1:8545";
  const defaultPk = "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6";

  const envPath = ".env";
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");

  const updatedLines = lines.map((line) => {
    if (line.startsWith("localhost_url=")) {
      return `localhost_url="${defaultUrl}"`;
    }
    if (line.startsWith("pk_localhost=") || line === "pk_localhost=") {
      return `pk_localhost="${defaultPk}"`;
    }
    return line;
  });

  // Append missing values if they were not found in .env
  if (!updatedLines.some((line) => line.startsWith("localhost_url="))) {
    updatedLines.push(`localhost_url="${defaultUrl}"`);
  }
  if (!updatedLines.some((line) => line.startsWith("pk_localhost="))) {
    updatedLines.push(`pk_localhost="${defaultPk}"`);
  }

  fs.writeFileSync(envPath, updatedLines.join("\n"));
  console.log(`Updated .env with localhost_url: ${defaultUrl} and pk_localhost: ${defaultPk}`);

  // Force reload of environment variables
  const envConfig = fs.readFileSync(envPath, "utf-8").split("\n");
  envConfig.forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^"|"$/g, ''); // Remove quotes
    }
  });

  // Validate pk_localhost after reload
  if (!process.env.pk_localhost || process.env.pk_localhost.length !== 66) {
    console.error("Error: pk_localhost is missing or has an invalid length in .env");
    process.exit(1);
  }
};

// Reload environment variables after updating .env
const reloadEnv = () => {
  dotenv.config();
  if (!process.env.pk_localhost || process.env.pk_localhost.length !== 66) {
    console.error("Error: pk_localhost is missing or has an invalid length in .env");
    process.exit(1);
  }
};

// Run the deployment script

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