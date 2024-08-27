import BN from 'bn.js';

const formatFieldTx = (str: string)=>{
      let x = str.slice(2);
      if(x === '0') { 
        x = '';
      }else if(x.length % 2 !==0) {
        x = `0${x}`;
      }
      
      return `0x${x}`;
}

const checkS = (v_int: number, s_int: string) => {
    let v = formatFieldTx(`0x${v_int.toString()}`);  // 0x..
    let s = s_int;  // 0x..
    const secp256k1N = new BN("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16); // max value on the curve
    const secp256k1halfN = secp256k1N.div(new BN(2)); // half of the curve
    let s_BN = new BN(s_int.slice(2), 16);    

    if (s_BN.toString(10) > secp256k1halfN.toString(10)) {
        s_BN = secp256k1N.sub(s_BN);
        s = `0x${s_BN.toString(16)}`; 
        if(v_int == 0) v = "0x1";
        else v = "0x0";
    }

    return {v, s}
}

const convertTypeToken = (type: string) => {
   if(type === 'ERC20') return '0020';
   else if(type === 'ERC721') return '0721';
   else if(type === 'ERC1155') return '1155';
}

export default {
  formatFieldTx,
  convertTypeToken,
  checkS
}

