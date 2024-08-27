import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import Navbar from "../../../components/Navbar";
import BinanceImage from "./images/Binance-logo 1.png";
import LogoMark from "./images/Logomark-Blue 1.png";
import "./styles.scss";

const BuyErc721_1150 = () => {
  return (
    <div className="buy--buyErc721_1150--page">
      <HeaderMain />
      <h2 className="text--title">Buy ERC721/ 1155</h2>
      <div className="buy--token--content">
        <div className="token--item">
          <img src={BinanceImage} alt="" />
          <button className="btn--primary">Go to Binance</button>
        </div>
        <div className="token--item">
          <img src={LogoMark} alt="" />
          <button className="btn--primary">Go to Opensea</button>
        </div>
        <div className="token--item">
          <img src={LogoMark} alt="" />
          <button className="btn--primary">Go to Opensea</button>
        </div>
      </div>
      <BackToHomeText/>
      <Navbar />
    </div>
  );
};

export default BuyErc721_1150;
