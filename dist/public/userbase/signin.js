var user_data = ' ';
$.getJSON('https://sfhacks2019-1551558382883.appspot.com/getAllUsers', function (data) {
    user_data = data;
});

// signIn function stores the cookie of one's username
function signIn() {
    // get username input
    // get password input
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    // stores the username input
    // stores the password input
    var dummy_user;
    var dummy_pass;
    // checks if the username and password matches
    // the database
    var validate = 0;
    // set the expiration date of the cookie to 30 minutes
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + (1800 * 1000);
    now.setTime(expireTime);

    // checks the database to see
    // matching username and password
    for (var key in user_data) {
        if (user_data.hasOwnProperty(key)) {
            if ((user == user_data[key].username) && (pass == user_data[key].password)) {
                dummy_user = user;
                dummy_pass = pass;
                validate = 1;
            }
        }
    }

    // store username, with expiration date of 30 minutes, in the cookie
    if (validate > 0) {
        deleteAllCookies();
        document.cookie = "username=" + dummy_user + "; expires=" + now.toUTCString()+';path=/';
        window.alert("Hi " + dummy_user + ", welcome to the SpotStop!!!");
        event.preventDefault();
        window.location.href = "http://onespotstop.com/";
    }
    // executes window alert that tell the user that 
    // username and/or password is wrong
    else {
        window.alert("username and/or password is incorrect!");
        event.preventDefault();
    }
}

// haven't used this function yet
// but is used to retrieve the stored username
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