import Link from "next/link";
import  Navbar  from "./components/main/Navbar";
import Footer from "./components/main/Footer";

export default function NotFound() {
    return (
        <>
            <header>
                <Navbar />
            </header>

            <main className="min-h-screen flex flex-col items-center justify-center gap-6 ">
                <h1 className="text-5xl font-bold">404</h1>

                <p>Page introuvable</p>

                <Link href="/">
                    Retour à l accueil
                </Link>
            </main>

            <footer>
                <Footer />
            </footer>
        </>

    );
}