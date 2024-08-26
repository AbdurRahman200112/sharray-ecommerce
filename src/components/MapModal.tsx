import dynamic from 'next/dynamic';
import Modal from 'react-modal';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '@/localization/index';
import { selectBusiness } from '@/redux/reducers/businessSlice';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer, TileLayer, and Marker from react-leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

Modal.setAppElement('#__next');

const containerStyle = {
  width: '100%',
  height: '100%',
};

const fallbackPosition = {
  lat: 33.312805,
  lng: 44.361488,
};

function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        setPosition(marker.getLatLng());
      }
    },
  };

  return <Marker position={position} draggable ref={markerRef} eventHandlers={eventHandlers} />;
}

function MapModal({
  isOpen,
  onRequestClose,
  onConfirm,
  initialPosition = fallbackPosition,
}: {
  isOpen: any;
  onRequestClose: any;
  onConfirm: any;
  initialPosition: any;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bs = useSelector(selectBusiness);

  const [center, setCenter] = useState(initialPosition);
  const mapRef = useRef(null);

  const handleConfirm = () => {
    onConfirm(center);
  };

  useEffect(() => {
    if (isOpen) {
      setCenter(initialPosition);
    }
  }, [isOpen, initialPosition]);

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
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={onRequestClose}>
      <MapContainer
        center={center}
        zoom={15}
        style={containerStyle}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <DraggableMarker position={center} setPosition={setCenter} />
      </MapContainer>
      <div className="left-0 w-full absolute bottom-4 flex justify-center items-center">
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
      <div
        className="left-0 w-full text-xl fixed inset-0 z-40 flex justify-center items-center z-10"
        style={{ pointerEvents: 'none' }}
      >
        <img className="w-24 h-24" src="/mapmarker.svg" alt="" />
      </div>
      <div
        style={{
          color: bs.textColor,
          backgroundColor: bs.mainColor,
        }}
        className="left-0 w-full fixed top-0 h-20 rounded-b-xl px-8 flex justify-between items-center"
      >
        <X onClick={onRequestClose} />
        <span className="text-xl">{t('confirmLocation')}</span>
      </div>
    </Modal>
  );
}

export default MapModal;
