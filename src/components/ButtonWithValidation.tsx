import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CryptoJS from 'crypto-js';
import PropTypes from 'prop-types';

const ButtonWithValidation = ({ onValidation, children, mainColor, textColor, isSending }) => {
  const [counter, setCounter] = useState(0);
  const [msg, setMsg] = useState({
    keysOnUp: 0,
    tapsCount: 0,
  });

  useEffect(() => {
    const button = document.getElementById('validationButton');
    if (button) {
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
    }

    const handleKeyup = () => {
      setMsg(prevMsg => ({ ...prevMsg, keysOnUp: prevMsg.keysOnUp + 1 }));
    };

    const handleClick = () => {
      setCounter(prev => prev + 1);
      setMsg(prevMsg => ({ ...prevMsg, tapsCount: prevMsg.tapsCount + 1 }));
    };

    window.addEventListener('keyup', handleKeyup);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const encryptByAES = (string, key) => {
    const ckey = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(string, ckey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString();
  };

  const key = 'fn1=function(){}';

  const handleClick = async () => {
    try {
      if (onValidation) await onValidation(msg, encryptByAES, key);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Button
      disabled={isSending}
      style={{
        backgroundColor: mainColor,
        color: textColor,
      }}
      className="w-full flex justify-center items-center h-12 text-lg rounded-full"
      id="validationButton"
      onClick={handleClick}
    >
      {isSending ? <LoadingOutlined /> : children}
    </Button>
  );
};

ButtonWithValidation.propTypes = {
  onValidation: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  mainColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  isSending: PropTypes.bool.isRequired,
};

export default ButtonWithValidation;
