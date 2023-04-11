import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function NavBar() {
    return (
        <>
            <h1>Web3 Social</h1>
            <WalletMultiButton className="bg-black" />
        </>
    );
}
