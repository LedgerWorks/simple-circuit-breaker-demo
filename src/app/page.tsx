import { Footer } from "@/components/Footer";
import { Game } from "@/components/Game";
import { Header } from "@/components/Header";

export default function Home() {
  const balance = 0; // TODO : get player balance
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <Header balance={balance} />
      <Game />
      <Footer />
    </main>
  );
}
