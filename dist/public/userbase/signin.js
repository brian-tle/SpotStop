var user_data = ' ';
$.getJSON('https://sfhacks2019-1551558382883.appspot.com/getAllUsers', function (data) {
    user_data = data;
});

function signIn() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;
    var decodedCookie;
    var dummy_user;
    var dummy_pass;
    var validate = 0;
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + (1800 * 1000);
    now.setTime(expireTime);

    for (var key in user_data) {
        if (user_data.hasOwnProperty(key)) {
            if ((user == user_data[key].username) && (pass == user_data[key].password)) {
                dummy_user = user;
                dummy_pass = pass;
                validate = 1;
            }
        }
    }

    if (validate > 0) {
        deleteAllCookies();
        document.cookie = "username=" + dummy_user + "; expires=" + now.toUTCString()+';path=/';
        window.alert("Hi " + dummy_user + ", welcome to the SpotStop!!!");
        event.preventDefault();
    }
}

function getCookie(username) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(username + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function deleteAllCookies() {
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    expires = date.toGMTString()

    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
   }