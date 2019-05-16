
// function getTop3() is a wrapper function that calls
// getTop3Markers() which requests the server for retrieveing data 
// of top 3 upvoted markers
function getTop3(){
    getTop3Markers();
}

// function moveToMap1() relocates to the map.html, zooming into 
// a marker with most upvote
function moveToMap1(){
    sessionStorage.topMarkerValidator = 'number1 sent';
   sessionStorage.img_src = document.getElementById('img1').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}

// function moveToMap2() relocates to the map.html, zooming into
// a marker with second most upvote
function moveToMap2(){
    sessionStorage.topMarkerValidator = 'number2 sent';
   sessionStorage.img_src = document.getElementById('img2').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}

// function moveToMap3() relocates to the map.html, zooming into
// a marker with third most upvote
function moveToMap3(){
    sessionStorage.topMarkerValidator = 'number3 sent';
   sessionStorage.img_src = document.getElementById('img3').src
    window.location = 'http://onespotstop.com/google_api/map.html';

}

// call getTop3() function when one accesses the homepage
getTop3();
