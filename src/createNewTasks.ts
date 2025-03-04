import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
let chainId = 57054;
// let chainId = 31337;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/originx/${chainId}.json`), 'utf8'));
const originXServiceManagerAddress = avsDeploymentData.addresses.originXServiceManager;
const originXServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/OriginXServiceManager.json'), 'utf8'));
// Initialize contract objects from ABIs
const originXServiceManager = new ethers.Contract(originXServiceManagerAddress, originXServiceManagerABI, wallet);


async function createNewTask(taskName: string) {
  try {
    // Send a transaction to the createNewTask function
    const tx = await originXServiceManager.taskAgent(taskName);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log(`Transaction successful with hash: ${receipt.hash}`);

    
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

// Function to create a new task with a random name every 15 seconds
function startCreatingTasks() {
    const idProtocol = 'SpectraV2_USDCe';
    console.log(`Creating new task with idProtocol: ${idProtocol}`);
    createNewTask(idProtocol);
}

// Start the process
startCreatingTasks();