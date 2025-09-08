import React, { useEffect, useRef, useState } from "react";
import "./LocationModal.css";

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // 좌표를 주소로 변환
  const getAddressFromCoords = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(lat, lng);

      geocoder.coord2Address(
        coord.getLng(),
        coord.getLat(),
        (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const address =
              result[0]?.address?.address_name ||
              `위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`;
            resolve(address);
          } else {
            resolve(`위도: ${lat.toFixed(4)}, 경도: ${lng.toFixed(4)}`);
          }
        }
      );
    });
  };

  // 맵 초기화
  useEffect(() => {
    if (!isOpen || !mapContainer.current || !window.kakao) return;

    const { kakao } = window;

    // 기본 위치 (서울 시청)
    const defaultLat = initialLocation?.lat || 37.5665;
    const defaultLng = initialLocation?.lng || 126.978;

    const mapOption = {
      center: new kakao.maps.LatLng(defaultLat, defaultLng),
      level: 3,
    };

    const kakaoMap = new kakao.maps.Map(mapContainer.current, mapOption);
    setMap(kakaoMap);

    // 마커 생성
    const mapMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(defaultLat, defaultLng),
    });
    mapMarker.setMap(kakaoMap);
    setMarker(mapMarker);

    // 초기 주소 설정
    getAddressFromCoords(defaultLat, defaultLng).then((address) => {
      setSelectedLocation({
        lat: defaultLat,
        lng: defaultLng,
        address,
      });
    });

    // 맵 클릭 이벤트
    kakao.maps.event.addListener(kakaoMap, "click", async (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();

      // 마커 위치 변경
      mapMarker.setPosition(latlng);

      // 주소 가져오기
      const address = await getAddressFromCoords(lat, lng);

      setSelectedLocation({
        lat,
        lng,
        address,
      });
    });

    // 현재 위치로 이동 버튼 기능
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const moveLatLon = new kakao.maps.LatLng(lat, lng);

          kakaoMap.setCenter(moveLatLon);
          mapMarker.setPosition(moveLatLon);

          getAddressFromCoords(lat, lng).then((address) => {
            setSelectedLocation({
              lat,
              lng,
              address,
            });
          });
        },
        (error) => {
          console.warn("현재 위치를 가져올 수 없습니다:", error);
        }
      );
    }
  }, [isOpen, initialLocation]);

  // 위치 선택 완료
  const handleLocationConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  // 현재 위치로 이동
  const handleMoveToCurrentLocation = () => {
    if (!navigator.geolocation || !map || !marker) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

        map.setCenter(moveLatLon);
        marker.setPosition(moveLatLon);

        getAddressFromCoords(lat, lng).then((address) => {
          setSelectedLocation({
            lat,
            lng,
            address,
          });
        });
      },
      (error) => {
        alert("현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        console.error("Geolocation error:", error);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-header">
          <h2>위치 선택</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="location-modal-content">
          <div className="map-controls">
            <button
              className="current-location-btn"
              onClick={handleMoveToCurrentLocation}
            >
              📍 현재 위치로 이동
            </button>
          </div>

          <div ref={mapContainer} className="kakao-map"></div>

          <div className="selected-location">
            <h3>선택된 위치</h3>
            <p>{selectedLocation?.address || "위치를 선택해주세요"}</p>
          </div>
        </div>

        <div className="location-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button
            className="confirm-button"
            onClick={handleLocationConfirm}
            disabled={!selectedLocation}
          >
            이 위치로 설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

