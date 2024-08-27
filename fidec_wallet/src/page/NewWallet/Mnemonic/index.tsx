import { Button } from "antd";
import {Link} from "react-router-dom";
import Footer from "../../../components/Footers";
import HeaderHome from "../../../components/Headers/HeaderHome/Header";
import {useSelector} from "react-redux";
import type { RootState } from "../../../store/store";
import "./styles.scss"; 

const MnemonicWords = () => {

  const acountState = useSelector((state : RootState) => state.accounts);
  const {mnemonic} = acountState; 
  
  return (
    <div>
      <div className="wallet--container">
        <div className="content--container">
          <HeaderHome />
          <p className="title--text">
            Your Wallet <br />
            is for EVM Blockchain Networks
          </p>
          <div style={{height: "156px", overflow: "auto", overflowX: "hidden"}} className="list--words--container" >
            {mnemonic.map((item, index) => {
              return <p className="list--item" key={index}>{index + 1}. {item}</p>;
            })}
          </div>
          <p className="text--desc">
            Please write down list of {mnemonic.length} words above <br />
            and keep in a safe place
          </p>
          <div style={{ margin: "0 20px" }}>
            <Button type="primary" className="btn--submit">
              <Link to="/new-wallet/mnemonic-generate-confirm">
              Continue Your Mnemonic Words
              </Link>
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MnemonicWords;
