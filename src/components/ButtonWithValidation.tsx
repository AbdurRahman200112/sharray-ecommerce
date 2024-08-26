import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';

const ButtonWithValidation = ({ onValidation, children, mainColor, textColor, isSending }) => {
  const [counter, setCounter] = useState(0);
  const [counterna, setCounterna] = useState(0);
  const [msg, setMsg] = useState({
    keysOnUp: 0,
    tapsCount: 0,
  });

  useEffect(() => {
    const button = document.getElementById('validationButton');
    const buttonRect = button.getBoundingClientRect();
    const btnClicks = Math.trunc(Number(buttonRect.top) + Number(buttonRect.left));
    setMsg(prevMsg => ({
      ...prevMsg,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      innerScreenWidth: window.innerWidth,
      innerScreenHeight: window.innerHeight,
      btnClicks: btnClicks,
    }));

    const handleKeyup = () =>
      setCounterna(prev => {
        setMsg(prevMsg => ({ ...prevMsg, keysOnUp: prev + 1 }));
        return prev + 1;
      });

    const handleClick = () =>
      setCounter(prev => {
        setMsg(prevMsg => ({ ...prevMsg, tapsCount: prev + 1 }));
        return prev + 1;
      });

    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const encryptByAES = (string, key) => {
    // console.log("Original String before encryption: ", string); // lgging original string before encryption
    let ckey = CryptoJS.enc.Utf8.parse(key);
    let encrypted = CryptoJS.AES.encrypt(string, ckey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    // console.log("Encrypted String: ", encrypted.ciphertext.toString()); // Logging encrypted string
    return encrypted.ciphertext.toString();
  };

  const key = 'fn1=function(){}';

  const handleClick = async () => {
    try {
      // console.log("Data before encryption: ", msg); // logging msg object before encryption
      if (onValidation) await onValidation(msg, encryptByAES, key);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        disabled={isSending}
        style={{
          backgroundColor: mainColor,
          color: textColor,
        }}
        className="w-full flex justify-center items-center h-12  text-lg rounded-full"
        id="validationButton"
        onClick={handleClick}
      >
        {isSending ? <LoadingOutlined /> : children}
      </Button>
    </>
  );
};

ButtonWithValidation.propTypes = {
  onValidation: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ButtonWithValidation;
