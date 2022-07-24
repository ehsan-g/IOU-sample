export interface EthereumTransaction {
  id: string;
  transactionHash: string;
  transactionStatus: string;
  createdTimestamp: Date;
  submittedTimestamp: Date;
  signedTimestamp: Date;
  to: string;
  from: string;
  value: string;
  data: string;
  gasUsed: string;
  fees: string;
  gasLimit: string;
  gasPrice?: string;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  nonce: string;
  signedRawTransaction: string;
  eager: true;
  type: string;
}
