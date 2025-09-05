import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  console.log("Deploying NGO Registry contract...");

  const ngoRegistry = await deploy("NGORegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("NGO Registry deployed to:", ngoRegistry.address);
};

export default func;
func.tags = ["NGORegistry"];
