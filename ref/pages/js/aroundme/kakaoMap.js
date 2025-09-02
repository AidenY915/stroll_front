const mapContainer = document.createElement("div");
mapContainer.id = "mapContainer";

var container = mapContainer; //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(37.494719665527384, 127.0300768938762), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};
var map = new kakao.maps.Map(container, options);

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
  infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var detailAddr = !!result[0].road_address
        ? "<div>도로명주소 : " + result[0].road_address.address_name + "</div>"
        : "";
      detailAddr +=
        "<div>지번 주소 : " + result[0].address.address_name + "</div>";

      var content =
        '<div class="bAddr">' +
        '<span class="title">법정동 주소정보</span>' +
        detailAddr +
        "</div>";

      // 마커를 클릭한 위치에 표시합니다
      marker.setPosition(mouseEvent.latLng);
      marker.setMap(map);

      // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
      infowindow.setContent(content);
      infowindow.open(map, marker);
      let guAddress = detailAddr;
      console.log(guAddress);
      const endIndex = guAddress.indexOf("구");
      const startIndex = guAddress.indexOf(":");
      if (endIndex == -1 || startIndex == -1) return;
      guAddress = guAddress.substring(startIndex + 2, endIndex + 1);
      console.log(document.getElementById("myLocation"));
      document.getElementById("myLocation").innerText = guAddress;
      document.research.address.value=guAddress;
    }
  });
});

function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
  // 좌표로 법정동 상세 주소 정보를 요청합니다
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    var infoDiv = document.getElementById("centerAddr");

    for (var i = 0; i < result.length; i++) {
      // 행정동의 region_type 값은 'H' 이므로
      if (result[i].region_type === "H" && infoDiv !== null) {
        infoDiv.innerHTML = result[i].address_name;
        break;
      }
    }
  }
}

let x;
let y;

//클릭 시 위도 경도 뽑기
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  // 클릭한 위도, 경도 정보를 가져옵니다
  var latlng = mouseEvent.latLng;

  // 마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);

  var message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
  message += "경도는 " + latlng.getLng() + " 입니다";
  y = latlng.getLat();
  x = latlng.getLng();
  document.research.x.value=x;
  document.research.y.value=y;
  console.log(message);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("body").appendChild(mapContainer);
});
