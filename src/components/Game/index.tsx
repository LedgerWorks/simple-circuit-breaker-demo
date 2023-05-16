import useSWR from "swr";
import { Flip, FlipStatus } from "../../../common/types";
import { Loader } from "../Loader";
import { Error } from "./Error";
import { Ready } from "./Ready";
import { Result } from "./Result";

export const Game = () => {
  const { data: flip } = useSWR<Flip>("/api/get-current-flip");

  const getContent = () => {
    switch (flip?.status) {
      case undefined:
        return <Loader />;
      case FlipStatus.Ready:
        return <Ready />;
      case FlipStatus.Loser:
      case FlipStatus.Winner:
      case FlipStatus.Reconciled:
        return <Result />;
      case FlipStatus.Error:
      default:
        return <Error />;
    }
  };

  return <div className="w-80 mx-auto">{getContent()}</div>;
};
