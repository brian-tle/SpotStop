/**
 * After realizing that signIn function does not
 * work in Firefox, I changed the approach by
 * using jQuery to intialized onclick event to
 * submit button with sbmt ID.
 * return false is there to prevent the submission.
 * If we do not prevent the submission, it will redirect
 * to dead link, and most importantly, the logIn() function
 * will not work
 */


var validate = false;

$(document).ready(function() {
$('#sbmt').click(function(event) {
    // get username input
    // get password input
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    logIn(user, pass);
    return false;
    });

});


// It is used to retrieve the stored username
// in the cookie
function getCookie() {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf("=")+1;
        var c_end = document.cookie.length;
/*         if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            } */;
        return document.cookie.substring(c_start, c_end);
        //}
    }
    return "";
}

// clears the cookie by setting the 
// expiration date to January 1st, 1970
function deleteAllCookies() {
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    expires = date.toGMTString()

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}