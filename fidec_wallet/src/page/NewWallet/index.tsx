import {useState} from "react";
import {useDispatch} from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import {setMnemonic} from "../../store/StoreComponents/Accounts/accounts";
import FooterText from "../../components/Footers";
import HeaderHome from "../../components/Headers/HeaderHome/Header";
import { openNotification } from "../../utils/helperUtil";
import "./styles.scss";

const NewWallet = () => {

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const generateWallet = async () => {
    setLoading(true); 
    const {result, message, mnemonic} = await window.Main.handleGenerateHDWallet();
    if(result){  
      dispatch(setMnemonic(mnemonic.split(" ")));
      setLoading(false);
      navigate("/new-wallet/mnemonic-words")
    }else {
      setLoading(false);
    }
    openNotification(message, result ? "success" : "error") 
  }

  return (
    <div className="wallet--page">
      <HeaderHome />
      <div className="text--container">
        <p className="description--text">
          We have detect that your Wallet <br />
          is for EVM Blockchain Networks
        </p>
        <p className="text--title--small">
          Check the list of EVM networks <a href="">here</a>
        </p>
      </div>

      <Button type="primary" className=" btn--primary" loading={loading} onClick={()=>generateWallet()}>
        Create Wallet 
      </Button>
      <Button type="primary" className="btn--primary">
        <Link to="/new-wallet/mnemonic-confirm">Import mnemonic words</Link>
      </Button>
      <p className="text--cancel">
        <Link to="/">Back to login</Link>
      </p>
      <FooterText />
    </div>
  );
};

export default NewWallet;
