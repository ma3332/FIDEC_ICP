import Footer from "../../components/Footers";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import "./styles.scss";
const NeedWalletConnect = () => {
  return (
    <div className="need--wallet--connect">
      <HeaderHome />
      <h1>
        No Wallet is detected <br />
        Please connect your Wallet
      </h1>
      <Footer />
    </div>
  );
};

export default NeedWalletConnect;
