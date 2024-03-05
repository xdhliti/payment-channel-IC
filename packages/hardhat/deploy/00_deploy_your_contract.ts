import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";
import hash_tip from "./hashchain";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployChannel: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const recipient = "0x0fc3e5E42eB30Fced32E97612E83e45B3b661b46"; // Endereço do destinatário
  const timeoutSeconds = 86400; // Por exemplo, 24 horas
  const marginWei = ethers.parseEther("1"); // Por exemplo, 1 ether// Substitua pelo seu segredo real
  const tip = hash_tip;

  await deploy("Channel", {
    from: deployer,
    args: [recipient, timeoutSeconds, marginWei, tip],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  console.log("👋 Initial greeting:");
};

export default deployChannel;

deployChannel.tags = ["Channel"];
