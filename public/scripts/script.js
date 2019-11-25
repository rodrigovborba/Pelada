function initMap() {
    window.onload = function () {
        let startPos;
        let geoSuccess = function (position) {
            startPos = position;
            document.getElementById('startLat').innerHTML = startPos.coords.latitude;
            document.getElementById('startLon').innerHTML = startPos.coords.longitude;
        };
        navigator.geolocation.getCurrentPosition(geoSuccess);
    };
    const ironhackBCN = {
        lat: 41.3977381,
        lng: 2.190471916
    };
    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 5,
            center: ironhackBCN
        }
    );
}
initMap();