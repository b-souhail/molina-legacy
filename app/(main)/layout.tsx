import Navbar from "../components/main/Navbar";
import Footer from "../components/main/Footer";
import { TopBar } from "../components/main/TopBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="[--main-header-height:7.5rem]">
        <header>
          <TopBar />
          <Navbar />
        </header>

        <main>{children}</main>
      </div>

      <Footer />
    </>
  );
}