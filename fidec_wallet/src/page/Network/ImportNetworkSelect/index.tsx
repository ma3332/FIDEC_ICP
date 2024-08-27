import { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { RootState } from "../../../store/store";
import { setCheckGetNetwork } from "../../../store/StoreComponents/Networks/networks";
import BackToHomeText from "../../../components/Footers/Back";
import HeaderMain from "../../../components/Headers/HeaderMain/HeaderMain";
import { Radio, Select, Space, message } from "antd";
import type { RadioChangeEvent } from "antd";
import "./styles.scss";
import Navbar from "../../../components/Navbar";
import { openNotification } from "../../../utils/helperUtil";

const ImportNetworkSelect = () => {

  const dispatch = useDispatch(); 

  const [chainID, setChainID] = useState<number>();
  const [disabled, setDisabled] = useState(true);

  const networkState = useSelector((state: RootState) => state.networks);
  const { networksAdd, networks } = networkState;

  const importNetwork =async ()=>{ 
    const {result, message} = await window.Main.handleImportNetwork({
      name: "",
      chainID: chainID,
      symbol: "",
      index: networks.length,
    });
    dispatch(setCheckGetNetwork(result));
    openNotification(message, result ? "success" : "error")
    if(result) localStorage.setItem("network_select", (networks.length).toString()) 
    setTimeout(() => {
      window.history.back();
    }, 1500);
  }
  const onChange = (e: RadioChangeEvent) => {
    setChainID(e.target.value);
    setDisabled(false);
  };

  return (
    <div className="walletIndex--page">
      <HeaderMain />
      <h2 className="text--title">Import Network</h2>
      <p className="sub--title">Network Name</p>
      <div className="main">
        <div className="content">
          <Radio.Group onChange={onChange} value={chainID}>
            <Space direction="vertical">
              {networksAdd.length > 0 &&
                networksAdd.map((item: any) => {
                  return <Radio value={item.chainID}>{item.name}</Radio>;
                })}
            </Space>
          </Radio.Group>
        </div>
        <button
          className="btn--gray--default"
          disabled={disabled}
          onClick={() => importNetwork()}
        >
          Import
        </button>
      </div>
      <BackToHomeText />
      <Navbar />
    </div>
  );
};

export default ImportNetworkSelect;
