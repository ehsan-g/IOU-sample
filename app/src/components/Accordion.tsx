import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Grid, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sign } from "../features/wallet/walletSlice";
import { LoadingButton } from "@mui/lab";

interface FormInput {
  quantity: number;
}
export default function Accordions() {
  const dispatch = useAppDispatch();

  const { contract } = useAppSelector((state) => state.wallet);

  const [expanded, setExpanded] = useState<string | false>(false);
  const [formValues, setFormValue] = useState<FormInput>({
    quantity: 0,
  });
  const [value, setValue] = useState<Date | null>(new Date());

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleQuantityChange = (event: any) => {
    setFormValue({ quantity: event.target.value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (value) {
      dispatch(sign({ units: formValues.quantity, timeStamp: value }));
    }
  };

  return (
    <Grid sx={{ maxWidth: "60%", margin: "auto" }}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "30%", flexShrink: 0 }}>
            Create IOU
          </Typography>
          <Typography>Owing: 0</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Due date"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  value={formValues?.quantity}
                  onChange={handleQuantityChange}
                  placeholder="Quantity"
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              {contract && (
                <LoadingButton variant="contained" type="submit" value="Submit">
                  sign & Mint
                </LoadingButton>
              )}
            </Grid>
          </form>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
