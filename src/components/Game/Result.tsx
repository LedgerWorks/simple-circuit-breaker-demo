import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Button } from "@mui/material";
import { fetcher } from "@/lib/fetcher";
import { toSide } from "@/lib/formatters";
import { Flip, FlipStatus } from "../../../common/types";
import { Loader } from "../Loader";
import { sleep } from "../../../common/utils";

export const Result = () => {
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  const { data: flip } = useSWR<Flip>("/api/get-current-flip");
  const { status, calledSide, flipResult } = flip || {};

  const getCurrentFlip = async (): Promise<Flip> => {
    const flipResponse = await fetch("/api/get-current-flip");
    if (!flipResponse.ok) {
      throw new Error("Failed to get current flip");
    }
    const currentFlip = await flipResponse.json();
    if (currentFlip.status !== FlipStatus.Ready) {
      await sleep(1000);
      return getCurrentFlip();
    }
    mutate("/api/get-current-flip", currentFlip, { revalidate: false });
    return currentFlip;
  };

  const handleReset = async () => {
    setSubmitting(true);
    try {
      const resetResponse = await fetcher("/api/reset", { method: "POST" });
      if (resetResponse.status === "success") {
        await sleep(1000);
        await getCurrentFlip();
      } else {
        console.log(resetResponse.error);
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const handleCollect = async () => {
    setSubmitting(true);
    try {
      const collectResponse = await fetcher("/api/collect", { method: "POST" });
      if (collectResponse.status === "success") {
        await sleep(1000);
        await handleReset();
      } else {
        console.log(collectResponse.error);
        setSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  if (status === undefined || calledSide === undefined || flipResult === undefined) {
    return <Loader />;
  }

  const winner = calledSide === flipResult;
  const operator = winner ? "=" : "≠";
  const colorClass = winner ? "text-green-800" : "text-red-600";
  const emoji = winner ? "🎉" : "🖕"; // "🤬";
  const resultText = winner ? "Winner!" : "Loser!";

  const winnerStatus = status === FlipStatus.Winner;
  const initialButtonText = winnerStatus ? "Collect" : "Play Again";
  const submittingButtonText = winnerStatus ? "Collecting..." : "Please Wait...";
  const buttonText = submitting ? submittingButtonText : initialButtonText;
  const handler = winnerStatus ? handleCollect : handleReset;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row w-full">
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex flex-row justify-center text-xs">You called:</div>
          <div className="flex flex-row justify-center text-xl uppercase font-bold">
            {toSide(calledSide)}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row justify-center text-xs">&nbsp;</div>
          <div className="flex flex-row justify-center text-xl uppercase font-bold">{operator}</div>
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <div className="flex flex-row justify-center text-xs">Flip result:</div>
          <div className="flex flex-row justify-center text-xl uppercase font-bold">
            {toSide(flipResult)}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mb-8">
        <div className={`flex flex-row justify-center text-4xl uppercase font-bold ${colorClass}`}>
          <span>{emoji}</span>
          <span className="blink px-4">{resultText}</span>
          <span>{emoji}</span>
        </div>
      </div>
      <Button
        type="button"
        size="large"
        variant="contained"
        color="primary"
        className="bg-primary"
        disabled={submitting}
        onClick={handler}
      >
        {buttonText}
      </Button>
    </div>
  );
};
