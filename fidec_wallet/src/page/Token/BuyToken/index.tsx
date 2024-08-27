import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import BackToHomeText from "../../../components/Footers/Back";
import BinanceImage from "./images/Binance-logo 1.png";
import CoinBaseImage from "./images/Coinbase-logo 1.png";
import "./styles.scss";
const BuyToken = () => {
  return (
    <div className="buy--token--page">
      <HeaderMain />
      <h2 className="text--title">Buy ETH</h2>
      <div className="buy--token--content">
        <div className="token--item">
          <img src={BinanceImage} alt="" />
          <button className="btn--primary">Go to Binance</button>
        </div>
        <div className="token--item">
          <img src={CoinBaseImage} alt="" />
          <button className="btn--primary">Go to Coinbase</button>
        </div>
        <div className="token--item">
          <img src={CoinBaseImage} alt="" />
          <button className="btn--primary">Go to Coinbase</button>
        </div>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default BuyToken;
