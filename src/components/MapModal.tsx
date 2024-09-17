import { useTranslation } from '@/localization/index';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Modal accessibility element
Modal.setAppElement('#__next');

const containerStyle = {
  width: '100%',
  height: '100%',
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
  const { t, currentLanguage } = useTranslation(); // Get translation and current language
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const bs = useSelector(selectBusiness);
  const [center, setCenter] = useState(initialPosition);
  const [currentPosition, setCurrentPosition] = useState(initialPosition); // Track marker position

  const handleConfirm = () => {
    onConfirm(currentPosition); // Use the dynamically updated position
  };

  useEffect(() => {
    if (isOpen) {
      setCenter(initialPosition);
      setCurrentPosition(initialPosition); // Set initial marker position
    }
  }, [isOpen, initialPosition]);

  // Update center dynamically when the map is moved
  function MapMoveHandler() {
    useMapEvents({
      dragend: (event) => {
        const map = event.target;
        const newCenter = map.getCenter();
        setCurrentPosition({ lat: newCenter.lat, lng: newCenter.lng }); // Update the marker's position
        setCenter({ lat: newCenter.lat, lng: newCenter.lng }); // Update the center state
      },
    });

    return null; // No JSX is returned, only used for side effects
  }

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

  // Determine if the layout should be RTL (for Arabic) or LTR (for English)
  const isRTL = currentLanguage === 'ar';

  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
      {isLoading && (
        <div className="flex justify-center bg-white z-50 absolute items-center h-full">
          <div className="loader"></div>
        </div>
      )}

      <MapContainer
        style={containerStyle}
        center={center}
        zoom={15}
        whenReady={() => setIsLoading(false)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapMoveHandler /> {/* Attach the map event handler here */}
      </MapContainer>

      {/* Button Container */}
      <div
        className="absolute bottom-4 left-0 w-full flex justify-center items-center z-50"
        style={{ zIndex: 1000 }} // Ensure button is on top of the map
      >
        <button
          style={{
            color: bs.textColor,
            backgroundColor: bs.mainColor,
          }}
          className="rounded-full py-3 text-xl w-[50%]"
          onClick={handleConfirm}
        >
          {t('confirmLocationBtn')}
        </button>
      </div>

      {/* Location Pin Icon in Center */}
      <div
        className="absolute inset-0 flex justify-center items-center z-50"
        style={{ pointerEvents: 'none', zIndex: 1000 }} // Ensure pin icon is visible
      >
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="w-18 h-18"
          style={{ color: '#028181', fontSize: '48px' }}
        />
      </div>

      {/* Modal Header with Close Icon and Text */}
      <div
        className="absolute top-0 left-0 w-full h-20 px-8 flex justify-between items-center z-50"
        style={{
          backgroundColor: bs.mainColor,
          color: bs.textColor,
          zIndex: 1001, // Ensure header stays on top
        }}
      >
        {/* Close icon on the left for RTL (Arabic) or right for LTR (English) */}
        <div className="flex items-center" style={{ order: isRTL ? 2 : 1 }}>
          <X onClick={onRequestClose} />
        </div>

        {/* "Select your location" text on the right for RTL (Arabic) or left for LTR (English) */}
        <div className="flex items-center" style={{ order: isRTL ? 1 : 2 }}>
          <span
            className="text-xl"
            style={{
              textAlign: isRTL ? 'right' : 'left', // Adjust text alignment
              marginLeft: isRTL ? 'auto' : '0', // Push to the right in RTL
              marginRight: isRTL ? '0' : 'auto', // Push to the left in LTR
            }}
          >
            {t('confirmLocation')}
          </span>
        </div>
      </div>
    </Modal>
  );
}

export default MapModal;
