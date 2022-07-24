import { Contract, ethers } from "ethers";
import IOU from "../../build/artifacts/contracts/IOU.sol/IOU.json";

export const connectWallet = async () => {
  window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { chainId } = await provider.getNetwork();
  console.log(`chain Id here: ${chainId}`);

  const signer = provider.getSigner();
  const walletAddress = await signer.getAddress();
  return { walletAddress, chainId };
};

export const signAndCreate = async (units: number, timeStamp: Date) => {
  await window.ethereum.enable();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  const SIGNING_DOMAIN_NAME = "IOU";
  const SIGNING_DOMAIN_VERSION = "1";

  const domainData = {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    chainId: await signer.getChainId(),
  };

  const types = {
    Voucher: [
      { name: "tokenUri", type: "string" },
      { name: "content", type: "string" },
    ],
  };
  // the data to sign / signature will be added to our solidity struct
  const voucher = {
    tokenUri: "tokenUri",
    content: `I accept the debt of ${units} DAI and agree to pay the holder of this token in full on or before ${new Intl.DateTimeFormat(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    ).format(timeStamp)}.`,
  };

  // signer._signTypedData(domain, types, value) =>  returns a raw signature
  const signature = await signer._signTypedData(domainData, types, voucher);

  const txCount = await provider.getTransactionCount(signerAddress);

  const gasPrice = await provider.getGasPrice();
  // build the transaction
  const tx = {
    nonce: ethers.utils.hexlify(txCount),
    to: signerAddress,
    value: ethers.utils.parseEther("0").toHexString(),
    gasLimit: ethers.utils.hexlify(10000000),
    gasPrice: ethers.utils.hexlify(gasPrice),
    data: signature,
  };

  signer.sendTransaction(tx).then((transaction: any) => {
    console.dir(transaction);
    alert("Send finished!");
  });
};

export const deployIOU = async () => {
  // eslint-disable-next-line no-undef
  await window.ethereum.enable();
  // eslint-disable-next-line no-undef
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const { chainId } = await provider.getNetwork();
  console.log(`chain Id here: ${chainId}`);

  const marketPlaceFactory = new ethers.ContractFactory(
    IOU.abi,
    IOU.bytecode,
    signer
  );

  const marketPlaceContract = await marketPlaceFactory.deploy();
  const tx = await marketPlaceContract.deployTransaction.wait(); // loading before confirmed transaction
  return tx.contractAddress;
};
// export const signTransaction = async (
//   account: SignerWithAddress,
//   ethereumTransaction: EthereumTransaction
// ) => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);

//   // TODO: To use a unique / sequnetial number for nonce of any accounts
//   const currentNonce = await provider.getTransactionCount(account.address);

//   const txParams: JsonTx = {
//     to: ethereumTransaction.to,
//     nonce: ethers.utils.hexlify(currentNonce),
//     value: ethers.utils.hexlify(BigInt(ethereumTransaction.value)),
//     data: ethereumTransaction.data,
//     gasLimit: ethers.utils.hexlify(BigInt(ethereumTransaction.gasLimit)),
//     type: ethers.utils.hexlify(BigInt(ethereumTransaction.type)),
//   };

//   let tx: FeeMarketEIP1559Transaction | Transaction;
//   const common = new Common({ chain: "rinkeby", hardfork: "london" });
//   const { chainId } = await provider.getNetwork();
//   common.setChain(chainId);

// // public static fromTxData(txData: TxData, opts: TxOptions = {}): instantiate from a data dictionary
// if (ethereumTransaction.type === "2") {
//   txParams.maxFeePerGas = ethers.utils.hexlify(
//     BigInt(ethereumTransaction.maxFeePerGas || "")
//   );
//   txParams.maxPriorityFeePerGas = ethers.utils.hexlify(
//     BigInt(ethereumTransaction.maxPriorityFeePerGas || "")
//   );
//   tx = FeeMarketEIP1559Transaction.fromTxData(
//     txParams as FeeMarketEIP1559TxData,
//     { common }
//   );
// } else {
//   txParams.gasPrice = ethers.utils.hexlify(
//     BigInt(ethereumTransaction.gasPrice || "")
//   );
//   tx = Transaction.fromTxData(txParams as JsonTx, { common });
// }
// console.log(tx);

// const signature = await account.signTransaction(tx);
// ethereumTransaction.signedRawTransaction =
//   "0x" + signature.serialize().toString("hex");

// ethereumTransaction.signedTimestamp = new Date();
// ethereumTransaction.transactionStatus = "signed";
// ethereumTransaction.nonce = newNonce.lastNonce.toString();
// };
