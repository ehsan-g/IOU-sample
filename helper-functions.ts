import { run } from "hardhat";

const verify = async (
  contractAddress: string,
  args: any[],
  ContractPath: string
) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
      contract: ContractPath,
    });
  } catch (e: any) {
    console.log(e);
  }
};

export default verify;
