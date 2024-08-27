import { useState, useEffect } from "react"; 
import { Button, Radio } from "antd";   
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../../../store/store"; 
import { getRecipientsAddress } from "../../../../utils/constants";  
import "./styles.scss";

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props  {
    setAddressSend: SetStateFunction<string>;  
    addressSend: string;
}


const AddressesSend = ({
  addressSend, 
  setAddressSend,   
}: Props)=>{

    const [listRecipientsAddress, setListRecipientsAddress] = useState<any>([]); 

    const accountsState = useSelector((state: RootState) => state.accounts);
    const { eip155Addresses } = accountsState;  
 
    useEffect(() => {
        getRecipientsAddress().then((result) => {
          setListRecipientsAddress(result);
        });
    }, []);

    return (
        <div className="send--token--content">
          <h2 className="text--title">Within my internal account</h2>
          <div className="content">
            <Radio.Group  value={addressSend}>
              {eip155Addresses.map(({ address, name, indexAccount }) => {
                if (indexAccount <= 9) {
                  return (
                    <div className="account--item" key={address}>
                      <Radio
                        value={address}
                        onChange={(e) => {
                          setAddressSend(e.target.value); 
                        }}
                      >
                        <div className="flex">
                          <p>{name}</p>
                          <p>
                            {address.slice(0, 5)}...{address.slice(-4)}
                          </p>
                        </div>
                      </Radio>
                    </div>
                  );
                } else if (indexAccount >= 10) {
                  return (
                    <div className="account--item" key={indexAccount}>
                      <Radio
                        value={address}
                        onChange={(e) => {
                          setAddressSend(e.target.value); 
                        }}
                      >
                        <div className="flex">
                          <p>{name}</p>
                          <p className="import--tag">Imported</p>
                          <p>
                            {address.slice(0, 5)}...{address.slice(-4)}
                          </p>
                        </div>
                      </Radio>
                    </div>
                  );
                }
              })}
            </Radio.Group>
          </div>
          {/* save recipients */}
          <h2 className="text--title">Within my saved recipients</h2>
          <div className="content">
            <Radio.Group value={addressSend}>
              {listRecipientsAddress.length &&
                listRecipientsAddress.map(({ name, address }: any) => {
                  return (
                    <div className="account--item" key={address}>
                      <Radio
                        value={address}
                        onChange={(e) => {  
                          setAddressSend(e.target.value);
                        }}
                      >
                        <div className="flex">
                          <p>{name}</p>
                          <p>
                            {address.slice(0, 5)}...{address.slice(-4)}
                          </p>
                        </div>
                      </Radio>
                    </div>
                  );
                })}
              <Link to="/save-recipients-page">
                <Button style={{ display: "flex", margin: "auto" }}>
                  Save new recipients
                </Button>
              </Link>
            </Radio.Group>
          </div>
        </div>
    )
}

export default AddressesSend;