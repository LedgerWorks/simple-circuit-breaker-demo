import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Flip, Side } from "../../../common/types";
import { fetcher } from "@/lib/fetcher";
import { useSWRConfig } from "swr";
import { FlipRequest } from "@/pages/api/flip";

export const Ready = () => {
  const [side, setSide] = useState(Side.Heads);
  const [wager, setWager] = useState(0.01);
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    const intervalId = setInterval(() => {
      mutate("/api/get-current-flip");
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [mutate]);

  const handleSideChange = (ev: SelectChangeEvent<number>) => {
    setSide(parseInt(`${ev.target.value}`, 10));
  };

  const handleWagerChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setWager(parseFloat(`${ev.target.value}`));
  };

  const handleFlip = async () => {
    setSubmitting(true);
    try {
      const body: FlipRequest = {
        side,
        wager,
        timestamp: Date.now(),
      };
      const result = await fetcher<Flip>("/api/flip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (result.status !== "success") {
        console.log(result.error);
        if (result.error === "Your current flip status does not allow this action.") {
          setTimeout(async () => {
            await handleFlip();
          }, 1000);
        } else {
          setSubmitting(false);
        }
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const wagerValidationError = (): string => {
    if (wager < 0.01) return "Wager cannot be less than 0.01";
    if (wager > 1) return "Wager cannot be more than 1.00";
    return "";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-center mb-8">
        <Image
          src="/avax-coin.svg"
          alt="AVAX Coin"
          className={submitting ? "flip" : ""}
          width={200}
          height={200}
          priority
        />
      </div>
      <div className="flex flex-row w-full gap-4">
        <FormControl className="w-full">
          <InputLabel id="side-label">Call</InputLabel>
          <Select
            fullWidth
            labelId="side-label"
            id="side"
            value={side}
            label="Call"
            disabled={submitting}
            onChange={handleSideChange}
          >
            <MenuItem value={Side.Heads}>Heads</MenuItem>
            <MenuItem value={Side.Tails}>Tails</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="w-full">
          <TextField
            fullWidth
            label="Wager"
            id="wager"
            value={wager}
            variant="outlined"
            type="number"
            inputProps={{
              min: 0.01,
              max: 1,
              step: 0.01,
            }}
            disabled={submitting}
            error={wagerValidationError().length > 0}
            helperText={wagerValidationError()}
            onChange={handleWagerChange}
          />
        </FormControl>
      </div>
      <Button
        type="button"
        size="large"
        variant="contained"
        color="primary"
        className="bg-primary"
        disabled={submitting}
        onClick={handleFlip}
      >
        {submitting ? "Flipping..." : "Flip"}
      </Button>
    </div>
  );
};
