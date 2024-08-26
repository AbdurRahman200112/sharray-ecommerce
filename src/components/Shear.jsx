// ShareDrawer.js
import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { Facebook } from '@/icons/Facebook';
import { Telegram } from '@/icons/Telegram';
import { XTwitter } from '@/icons/XTwitter';
import { Whatsapp } from '@/icons/Whatsapp';
import { Copy } from 'lucide-react';

import { useTranslation } from '../localization/index';

const Shear = ({ isVisible, onClose, productUrl, productTitle }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { t, currentLanguage } = useTranslation();
  const copyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = productUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 3000);
  };

  const shareOnFacebook = () => {
    const text = `${t('shareText')} ${productTitle}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}&t=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `${t('shareText')} ${productTitle}`;
    const url = `https://twitter.com/share?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank');
  };
  const shareOnWhatsApp = () => {
    const text = `${t('shareText')} ${productTitle}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  const shareOnTelegram = () => {
    const text = `${t('shareText')} ${productTitle}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(
      productUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };
  const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';

  return (
    <>
      <Drawer
        title={t('share') + ' ' + productTitle}
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={isVisible}
        height={220}
        key="bottom"
        className="rounded-t-2xl flex  flex-col gap-3"
        style={{ direction }}
      >
        <Button
          className="flex items-center justify-center"
          block
          onClick={copyToClipboard}
          icon={<Copy className="w-5 h-5" />}
        >
          <span className="">{isCopied ? t('copied') : t('copy')}</span>
        </Button>
        <div className="flex mt-4 w-full  justify-around">
          <div
            className=" bg-blue-600 cursor-pointer text-white text-4xl flex justify-center items-center rounded-full w-14 h-14"
            onClick={shareOnFacebook}
          >
            <Facebook className="fill-white w-8 h-8" />
          </div>
          <div
            className=" bg-black cursor-pointer text-white text-4xl flex justify-center items-center rounded-full w-14 h-14"
            onClick={shareOnTwitter}
          >
            <XTwitter className="fill-white w-8 h-8" />
          </div>
          <div
            className=" bg-green-500 cursor-pointer text-white text-4xl flex justify-center items-center rounded-full w-14 h-14"
            onClick={shareOnWhatsApp}
          >
            <Whatsapp className="fill-white w-8 h-8" />
          </div>
          <div
            className=" bg-blue-400 cursor-pointer text-white text-4xl flex justify-center items-center rounded-full w-14 h-14"
            onClick={shareOnTelegram}
          >
            <Telegram className="fill-white w-8 h-8" />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Shear;
