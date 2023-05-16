import Image from "next/image";
import { Balance } from "./Balance";
import "@/styles/flip.css";

export const Header = () => {
  return (
    <div className="flex w-full flex-row items-start justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <Image src="/avax-coin.svg" alt="AVAX Coin" width={60} height={60} priority />
        <h1 className="text-4xl">AVAX Coin Flip</h1>
      </div>
      <div className="flex flex-row items-end gap-2 text-md">
        <Image src="/wallet.svg" alt="wallet" width={24} height={24} priority />
        <Balance />
        <Image src="/avax-icon.svg" alt="Avax icon" width={20} height={20} priority />
      </div>
    </div>
  );
};
