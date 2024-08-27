import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_CHAINS } from "../../../data/networkConfig/chainsUtil";
import { useDispatch } from "react-redux";
import { setCheckLogin } from "../../../store/StoreComponents/Accounts/accounts";
import { setLoading } from "../../../store/Support/Loading/LoadingSlice";
import { openNotification } from "../../../utils/helperUtil";
import { Radio, RadioChangeEvent, Space } from "antd";

const ImportNetworkDeafault = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [chainID, setChainID] = useState<number>();
  const [disabled, setDisabled] = useState(true);

  const importNetworkDeafault = async () => {
    const { result, message } = await window.Main.handleImportNetwork({
      name: "",
      chainID,
      symbol: "",
      url: "",
      index: 0,
    });
    if (result) {
      navigate("/");
    }
    dispatch(setLoading(result));
    dispatch(setCheckLogin(result));
    openNotification(message, "error");
  };

  const onChange = (e: RadioChangeEvent) => {
    setChainID(e.target.value);
    setDisabled(false);
  };

  useEffect(() => {
    dispatch(setLoading(false));
  }, []);
 

  return (
    <div className="walletIndex--page">
      <h2 className="text--title">Import Wallet Index</h2>
      <p className="sub--title">Network Name</p>
      <div className="main">
        <div className="content">
        <Radio.Group onChange={onChange} value={chainID}>
            <Space direction="vertical">
              {Object.values(ALL_CHAINS).map((item) => {
                  return <Radio value={item.chainID}>{item.name}</Radio>;
              })}
            </Space>
          </Radio.Group> 
        </div>
        <button
          className="btn--gray--default"
          disabled={disabled}
          onClick={() => importNetworkDeafault()}
        >
          Import
        </button>
      </div>
    </div>
  );
};

export default ImportNetworkDeafault;
