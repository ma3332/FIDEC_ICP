import Footer from "../../components/Footers";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import "./styles.scss";

const NeedWalletConnectLoading = () => {
  return (
    <div className="wallet--loading">
      <HeaderHome />
      <h1>
        Wallet is detected <br />
        Please wait ...
      </h1>
      <Footer />
    </div>
  );
};

export default NeedWalletConnectLoading;
