// import { Inter } from "next/font/google";
// import NoSSR from "react-no-ssr";
import { ReactNode } from "react";

// const inter = Inter({ subsets: ["latin"] });

const Home = ({ children }: { children: ReactNode }) => {
    return (
        <h1 className="p-3 w-full font-bold text-xl">
            Explore feed should come here!
        </h1>
    );
};

export default Home;
