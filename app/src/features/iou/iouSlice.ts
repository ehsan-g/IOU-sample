import { TransactionReceipt } from "@ethersproject/providers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import IOU from "../../contracts/IOU.sol/IOU.json";

export interface balanceState {
  balance?: number;
  iou?: string;
  status: "idle" | "loading" | "failed";
}

const initialState: balanceState = {
  status: "idle",
};

export const fetchIouBalance = createAsyncThunk("iou/Balance", async () => {
  // eslint-disable-next-line no-undef
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const signerFactory = new ethers.ContractFactory(
    IOU.abi,
    IOU.bytecode,
    signer
  );

  const contractLocal = localStorage.getItem("contract")
    ? JSON.parse(localStorage.getItem("contract") || "")
    : null;

  const signerContract = signerFactory.attach(contractLocal);

  const withdraw = await signerContract.owing();
});

export const WalletSlice = createSlice({
  name: "myWallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default WalletSlice.reducer;
