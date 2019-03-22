var user_data = ' ';
$.getJSON('https://sfhacks2019-1551558382883.appspot.com/getAllUsers', function (data) {
    user_data = data;
});
/* class User {
    constructor(username, password){
        this.user = username;
        this.password = password;
        this.marker = [];
        this.rating = {};
    }

    get getUsername() {
        return getUser();
    }
    get getPassword() {
        return getPass();
    }
    get getMarker() {
        return getM();
    }
    get getRating() {
        return getR();
    }

    getUser() {
        return this.user;
    }
    getPass() {
        return this.password;
    }
    getM() {
        return this.marker;
    }
    getR() {
        return this.rating;
    }
} */

function createUser() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var re_pass = document.getElementById("repeat_password").value;
    var check = 0;
    
    for (var key in user_data) {
        if (user_data.hasOwnProperty(key)) {
            if (user_data[key].username == user) {
                check =1 ;
            }
        }
    }
    
    if ((pass == re_pass) && check > 0) {
        window.alert('Username already exists!');
        event.preventDefault();
    }
    
     else if ((pass == re_pass) && check == 0) {
        addUser(user, pass);
        window.alert('Signed Up!!!');
        event.preventDefault();
        window.location.href = "http://onespotstop.com/";
 
    } 
    
    else {
        window.alert("Password is incorrect!!!");
        event.preventDefault();
    }
}
