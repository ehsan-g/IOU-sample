import React from "react";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Accordions from "./components/Accordion";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { connect, deploy } from "./features/wallet/walletSlice";

function App() {
  const dispatch = useAppDispatch();

  const { status, contract } = useAppSelector((state) => state.wallet);

  const handleClick = () => {
    dispatch(connect());
  };

  const handleDeploy = async () => {
    dispatch(deploy());
  };

  return (
    <Grid container>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={6} sx={{ marginBottom: 10 }}>
          {!contract && (
            <LoadingButton
              loading={status === "loading"}
              onClick={handleDeploy}
              variant="outlined"
            >
              Deploy IOU Maker
            </LoadingButton>
          )}
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right", marginBottom: 10 }}>
          {contract && (
            <LoadingButton
              loading={status === "loading"}
              onClick={handleClick}
              variant="outlined"
            >
              Connect Wallet - {status}
            </LoadingButton>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Accordions />
      </Grid>
    </Grid>
  );
}

export default App;
