import { Fragment, useState, useRef  } from "react";
import { useSelector } from "react-redux";
import ReactQrReader from "react-qr-reader-es6";
import { RootState } from "../../../../store/store";
import Web3 from "web3";
import { Button, Modal } from "antd";

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface IProps {
  setAddressSend: SetStateFunction<string>;
  setOpenView: SetStateFunction<boolean>;
  setErrorCheckAddress: SetStateFunction<string>;
}
const ImageQr = ({
  setAddressSend,
  setOpenView,
  setErrorCheckAddress,
}: IProps
) => {
 
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); 

  const networksState = useSelector((state: RootState) => state.networks);
  const { network } = networksState;
  const { url } = network;
  const web3 = new Web3(url);

 
  function onError() {
    setShow(false);
  }

  async function onScan(data: string | null) {
    if (data) {
      setAddressSend(data.slice(-42));
      setShow(false); 
      if (web3.utils.isAddress(data.slice(-42))) {
        setOpenView(true);
      } else {
        setErrorCheckAddress("Correct EVM address");
      }
    }
  }

  function onShowScanner() {
    setLoading(true);
    setShow(true);
  }


  return (
    <div style={{ display: "flex" }}>
      <svg
        onClick={() => onShowScanner()}
        width="29"
        height="29"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_363_684)">
          <path
            d="M9.375 0H0V9.375H9.375V0ZM7.8125 7.8125H1.5625V1.5625H7.8125V7.8125Z"
            fill="white"
          />
          <path d="M3.125 3.125H6.25V6.25H3.125V3.125Z" fill="white" />
          <path
            d="M0 25H9.375V15.625H0V25ZM1.5625 17.1875H7.8125V23.4375H1.5625V17.1875Z"
            fill="white"
          />
          <path d="M3.125 18.75H6.25V21.875H3.125V18.75Z" fill="white" />
          <path
            d="M15.625 0V9.375H25V0H15.625ZM23.4375 7.8125H17.1875V1.5625H23.4375V7.8125Z"
            fill="white"
          />
          <path d="M18.75 3.125H21.875V6.25H18.75V3.125Z" fill="white" />
          <path
            d="M3.125 10.9375H0V14.0625H4.6875V12.5H3.125V10.9375Z"
            fill="white"
          />
          <path
            d="M10.9375 14.0625H14.0625V17.1875H10.9375V14.0625Z"
            fill="white"
          />
          <path d="M4.6875 10.9375H7.8125V12.5H4.6875V10.9375Z" fill="white" />
          <path
            d="M14.0625 18.75H10.9375V20.3125H12.5V21.875H14.0625V20.3125V18.75Z"
            fill="white"
          />
          <path
            d="M9.375 10.9375V12.5H7.8125V14.0625H10.9375V10.9375H9.375Z"
            fill="white"
          />
          <path d="M12.5 6.25H14.0625V9.375H12.5V6.25Z" fill="white" />
          <path
            d="M14.0625 12.5V14.0625H17.1875V10.9375H12.5V12.5H14.0625Z"
            fill="white"
          />
          <path d="M10.9375 9.375H12.5V10.9375H10.9375V9.375Z" fill="white" />
          <path d="M14.0625 21.875H17.1875V25H14.0625V21.875Z" fill="white" />
          <path d="M10.9375 21.875H12.5V25H10.9375V21.875Z" fill="white" />
          <path
            d="M14.0625 17.1875H15.625V18.75H14.0625V17.1875Z"
            fill="white"
          />
          <path
            d="M14.0625 4.6875V1.5625H12.5V0H10.9375V6.25H12.5V4.6875H14.0625Z"
            fill="white"
          />
          <path d="M18.75 21.875H20.3125V25H18.75V21.875Z" fill="white" />
          <path d="M18.75 18.75H21.875V20.3125H18.75V18.75Z" fill="white" />
          <path
            d="M17.1875 20.3125H18.75V21.875H17.1875V20.3125Z"
            fill="white"
          />
          <path d="M15.625 18.75H17.1875V20.3125H15.625V18.75Z" fill="white" />
          <path
            d="M21.875 15.625V17.1875H23.4375V18.75H25V15.625H23.4375H21.875Z"
            fill="white"
          />
          <path
            d="M23.4375 20.3125H21.875V25H25V21.875H23.4375V20.3125Z"
            fill="white"
          />
          <path
            d="M15.625 15.625V17.1875H20.3125V14.0625H17.1875V15.625H15.625Z"
            fill="white"
          />
          <path
            d="M18.75 10.9375V12.5H21.875V14.0625H25V10.9375H21.875H18.75Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_363_684">
            <rect width="25" height="25" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <Modal
        open={show}
        width={285}
        onCancel={() => {
          setShow(false);  
        }}
        closeIcon={false} 
        footer={false}
      >
        <Fragment>
          {loading && <div className="loading" />}
          <div className="qrVideoMask">
            <div className="qrContainer">
             {
              show && 
              <ReactQrReader
                onLoad={() => setLoading(false)}
                showViewFinder={false}  
                onError={onError}
                onScan={onScan}
                style={{ width: "160px", height: "160px", margin: "auto" }}
                className="qr--content"
              />
             } 
            </div> 
          </div>
        </Fragment>
      </Modal>

    </div>
  );
};

export default ImageQr;
