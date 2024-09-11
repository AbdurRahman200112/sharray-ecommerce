import { BASE_GOOGLE } from '@/lib/Common';
import { useTranslation } from '@/localization/index';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import the solid location pin icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

Modal.setAppElement('#__next');

const containerStyle = {
  width: '100%',
  height: '100%',
};

const fallbackPosition = {
  lat: 33.312805,
  lng: 44.361488,
};

function MapModal({
  isOpen,
  onRequestClose,
  onConfirm,
  initialPosition,
}: {
  isOpen: any;
  onRequestClose: any;
  onConfirm: any;
  initialPosition: any;
}) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const bs = useSelector(selectBusiness);

  const [center, setCenter] = useState(initialPosition);
  const mapRef = useRef(null);

  const [currentCenter, setCurrentCenter] = useState(initialPosition);

  const onDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter().toJSON();
      console.log('New Center:', newCenter);
      setCurrentCenter(newCenter);
    }
  };

  const onCenterChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter().toJSON();
      console.log('New Center:', newCenter);
    }
  };

  const handleConfirm = () => {
    if (mapRef.current) {
      const confirmedCenter = mapRef.current.getCenter().toJSON();
      console.log('Confirmed Location:', confirmedCenter);
      onConfirm(confirmedCenter);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCenter(initialPosition);
    }
  }, [isOpen, initialPosition]);

  useEffect(() => {
    console.log('Updated Center:', center);
  }, [center]);

  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2),
  });

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 999,
      padding: 0,
      margin: 0,
    },
    content: {
      top: 0,
      margin: 0,
      padding: 0,
      border: 'none',
      overflow: 'auto',
      position: 'fixed',
      inset: 0,
      left: 0,
      zIndex: 999,
    },
  };

  return (
    <>
      <LoadScript
        key={isOpen}
        googleMapsApiKey={BASE_GOOGLE}
        preventGoogleFontsLoading
        id="script-loader"
      >
        <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
          {isLoading && (
            <div className="flex justify-center bg-white z-50 absolute items-center h-full">
              <div className="loader"></div>
            </div>
          )}

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={(map) => {
              setIsLoading(false);

              mapRef.current = map;
              map.addListener('center_changed', onCenterChanged);
            }}
            onDragEnd={onDragEnd}
          ></GoogleMap>
          <div className="left-0 w-full absolute bottom-4 flex justify-center items-center">
            <button
              style={{
                color: bs.textColor,
                backgroundColor: bs.mainColor,
              }}
              className="rounded-full py-3 text-xl w-[50%] "
              onClick={handleConfirm}
            >
              {t('confirmLocationBtn')}
            </button>
          </div>
          <div
            className="left-0 w-full text-xl fixed inset-0 z-40 flex justify-center items-center z-10"
            style={{ pointerEvents: 'none' }}
          >
            {/* Replaced with the location pin icon */}
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-18 h-18"
              style={{ color: '#028181' ,fontSize:'48px'}} // Red color for the location pin
            />
          </div>
          <div
            style={{
              color: bs.textColor,
              backgroundColor: bs.mainColor,
            }}
            className="left-0 w-full fixed top-0 h-20 rounded-b-xl px-8 flex justify-between items-center"
          >
            <X
              onClick={(e) => {
                onRequestClose();
              }}
            />
            <span className="text-xl">{t('confirmLocation')}</span>
          </div>
        </Modal>
      </LoadScript>
    </>
  );
}

export default MapModal;
