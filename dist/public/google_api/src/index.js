
function getTop3(){
    getTop3Markers();
}

function moveToMap1(){
    sessionStorage.topMarkerValidator = 'number1 sent';
   sessionStorage.img_src = document.getElementById('img1').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}

function moveToMap2(){
    sessionStorage.topMarkerValidator = 'number2 sent';
   sessionStorage.img_src = document.getElementById('img2').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}

function moveToMap3(){
    sessionStorage.topMarkerValidator = 'number3 sent';
   sessionStorage.img_src = document.getElementById('img3').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}


getTop3();
