import { Form, Input } from "antd";
import ImageQr from "./ImageQr";
import Web3 from "web3";
import { useSelector } from "react-redux";
import {useEffect} from "react"
import type { RootState } from "../../../../store/store"; 
 
type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
    address: string;
    setAddress: SetStateFunction<string>;
    setOpenView: SetStateFunction<boolean>;
    setErrorCheckAddress: SetStateFunction<string>; 
    errorCheckAddress: string;
}

const InputSearch = ({
    address, 
    setAddress, 
    setOpenView,
    setErrorCheckAddress, 
    errorCheckAddress
  }:Props)=>{

      
    const networksState = useSelector((state: RootState) => state.networks);
    const { network } = networksState;
    const { url } = network;

    const web3 = new Web3(url);

    const checkAddressSend = async (
        address: string,
        setOpenView: SetStateFunction<boolean>,
        setErrorCheckAddress: SetStateFunction<string>
        ) => {
        try {
          if (address) {
            const res =  web3.utils.isAddress(address); 
            if (res) {
              setErrorCheckAddress("");
              setOpenView(true);
            } else {
              setOpenView(false);
              setErrorCheckAddress("Correct EVM address");
            }
          } else {
            setOpenView(false);
          }
        } catch (error) {
          setOpenView(false);
          setErrorCheckAddress("Correct EVM address"); 
        }
        return;
      };

      useEffect(() => { 
            checkAddressSend(address, setOpenView, setErrorCheckAddress); 
      }, [address])

    return (
        <div className="input--form--container">
        <p className="title--form">External Address</p>
        <Form>
          <Form.Item>
            <div className="input--search--container">
              {/* <SearchOutlined /> */}
              <Input
                placeholder="Public Address, ENS"
                value={address}
                onChange={(e) => { 
                  setAddress(e.target.value); 
                }}
              />
              <ImageQr 
              setAddressSend={setAddress}
              setOpenView={setOpenView}
              setErrorCheckAddress={setErrorCheckAddress}
            
              />
            </div>
          </Form.Item>
        </Form>
        {/* xử lý logic ở đây */}
        <p className="text--response">{errorCheckAddress}</p>
      </div>

    )
}

export default InputSearch;