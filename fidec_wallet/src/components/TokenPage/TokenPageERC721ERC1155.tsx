import { Link, useNavigate } from "react-router-dom";
import { Button, Empty, Typography } from "antd";
import EthereumIcon from "../../data/images/Ethereum.png";
import "./styles.scss";
import TokenGroupERC721ERC155 from "./component/TokenGroupERC721ERC1155";
import TokenInfo721 from "./component/TokenInfo721";
import TokenInfo1155 from "./component/TokenInfo1155";
import CannotTokenText from "../Footers/CannotTokenText";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setShowInfoNFT } from "../../store/StoreComponents/Tokens/tokens";
import { setDisableHeader } from "../../store/StoreComponents/Accounts/accounts";
import { useEffect } from "react";
import { openNotification } from "../../utils/helperUtil";

const TokenPageERC721and1155 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accountsState = useSelector((state: RootState) => state.accounts);
  const tokensState = useSelector((state: RootState) => state.tokens);
  const { eip155Address }: any = accountsState;
  const { address, name, indexAccount }: any = eip155Address;
  const {
    addressesERC721and1155,
    addressERC721or1155,
    infoNFT721,
    infoNFT1155,
    showInfoNFT,
  }: any = tokensState;
  const { addressToken, type, symbol, balance } = addressERC721or1155;

  useEffect(() => {
    dispatch(setDisableHeader({}));
  }, []);


  return (
    <div className="token--page--container">
      <div className="account--container">
        <div className="account--name">
          <p>{name}</p>
          <Typography.Paragraph
            copyable={{
              tooltips: false,
              text: address,
            }}
          >
            {address.substring(0, 6)}...
          </Typography.Paragraph>
        </div>
        <div className="content--container">
          <img src={EthereumIcon} alt="" />
          <h1>
            {balance} {symbol}
          </h1>
          <div className="btn--group">
            <Button type="primary" onClick={() =>navigate("/token/buy-token")}>
              BUY
            </Button>
              <Button
                type="primary"
                onClick={() =>{
                  if(addressesERC721and1155.length > 0 ){
                    navigate("/token/send-nft")
                    dispatch(
                      setDisableHeader({ pointerEvents: "none", opacity: 0.5 })
                    )
                  }else openNotification("No NFT", "warning");
                }
                }
              >
                SEND
              </Button>
          </div>
        </div>
        <div className="token--content">
          {!showInfoNFT ? (
            addressesERC721and1155.length == 0 ? (
              <Empty
                description={
                  <p style={{ margin: "0", color: "white" }}>No NFT</p>
                }
                imageStyle={{ height: "100px" }}
                
              />
            ) : (
              addressesERC721and1155.map(
                (
                  { addressToken, type, symbol, indexToken }: any,
                  index: number
                ) => {
                  const info: object = {
                    addressToken,
                    type,
                    symbol,
                    indexToken,
                    index,
                  };
                  return (
                    <TokenGroupERC721ERC155 key={indexToken} info={info} />
                  );
                }
              )
            )
          ) : (
            <div className="token--container">
              {type === "ERC721"
                ? infoNFT721.tokenInfo.map((item: any, index: number) => {
                    const info: any = {
                      addressToken,
                      address,
                      tokenId: item,
                      type,
                    };
                    return <TokenInfo721 key={index} info={info} />;
                  })
                : infoNFT1155.tokenInfo.map((item: any, index: number) => {
                    const info: any = {
                      addressToken,
                      address,
                      tokenInfo: item,
                      type,
                    };
                    return <TokenInfo1155 key={index} info={info} />;
                  })}
            </div>
          )}
        </div>
      </div>
      {!showInfoNFT ? (
        <CannotTokenText type={"NFTs"} />
      ) : (
        <div className="cannot--token--text">
          <Link to="" onClick={() => dispatch(setShowInfoNFT(false))}>
            Back to previous page
          </Link>
        </div>
      )}
    </div>
  );
};

export default TokenPageERC721and1155;
