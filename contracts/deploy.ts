import { ethers, network } from "hardhat";

type DeploymentResult = {
  name: string;
  address: string;
};

type DeploymentBuilder = {
  name: string;
  constructorArgBuilder: (previousDeployments: Record<string, DeploymentResult>) => unknown[];
};

/**
 * Given a map of previous deployments and a deployment builder, run the deployment using the
 * deployment builder. This pattern allows constructing "dependent deployments" that may need
 * the address of previous ones (e.g. delgating contracts with constructor injection)
 * @param previousDeployments Previously completed deployments that can be looked up by contract name
 * @param deploymentBuilder A deployment builder for the current deployment
 * @returns The deployment result for the current deployment
 */
async function deploy(
  previousDeployments: Record<string, DeploymentResult>,
  deploymentBuilder: DeploymentBuilder
): Promise<DeploymentResult> {
  const contract = await ethers.getContractFactory(deploymentBuilder.name);
  const constructorArgs = deploymentBuilder.constructorArgBuilder(previousDeployments);
  const deployment = await contract.deploy(...constructorArgs);
  await deployment.deployed();
  const argsString = constructorArgs.length ? `Constructor args: ${constructorArgs}, ` : "";
  console.info(
    `Deployed ${deploymentBuilder.name} to the ${network.name} network. ${argsString}Address: ${deployment.address}`
  );
  return { name: deploymentBuilder.name, address: deployment.address };
}

function independentDeployment(name: string, ...constructorArgs: unknown[]): DeploymentBuilder {
  return {
    name,
    constructorArgBuilder: () => constructorArgs,
  };
}

const deployments: DeploymentBuilder[] = [
  independentDeployment("CoinFlip"),
];

async function main() {
  await deployments.reduce(async (pendingDeployments, deploymentBuilder) => {
    const previousDeployments = await pendingDeployments;
    const deploymentResult = await deploy(previousDeployments, deploymentBuilder);
    return { ...previousDeployments, [deploymentBuilder.name]: deploymentResult };
  }, Promise.resolve({} as Record<string, DeploymentResult>));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
