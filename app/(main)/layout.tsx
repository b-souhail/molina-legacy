import Navbar from "../components/main/Navbar";
import Footer from "../components/main/Footer";
import { TopBar } from "../components/main/TopBar";
import ProfessionStrip from "../components/main/SubNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <TopBar />
        <Navbar />
        <ProfessionStrip />
      </header>

      <main>{children}</main>

      <Footer />
    </>
  );
}