import Image from "next/image";

export const Header = ({ balance }: { balance: number }) => {
  const formatAvax = (amount: number): string => {
    const roundedAmount = Math.round((amount + Number.EPSILON) * 1000) / 1000;
    const fixedAmount = roundedAmount.toFixed(3);
    return fixedAmount.toString();
  };
  return (
    <div className="flex w-full flex-row items-start justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <Image src="/avax-token.svg" alt="Avax Coin" width={60} height={60} priority />
        <h1 className="text-4xl">Avax Coin Flip</h1>
      </div>
      <div className="flex flex-row items-end gap-2">
        <Image
          src="/wallet.svg"
          alt="wallet"
          className="dark:invert"
          width={24}
          height={24}
          priority
        />
        <div>{formatAvax(balance ?? 0)}</div>
        <Image src="/avalanche-icon.svg" alt="wallet" width={16} height={16} priority />
      </div>
    </div>
  );
};
