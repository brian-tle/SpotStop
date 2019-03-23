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
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    var re_pass = document.getElementById("repeat_password").value;
    var user_check = 0;
    var email_check = 0;
    
    for (var key in user_data) {
        if (user_data.hasOwnProperty(key)) {
            if (user_data[key].username == user) {
                user_check = 1 ;
            }
            if (user_data[key].email == email) {
                email_check = 1;
            }
        }
    }
    
    if ((pass == re_pass) && user_check > 0) {
        window.alert('Username already exists!');
        event.preventDefault();
    }

    else if ((pass == re_pass) && email_check > 0) {
        window.alert('Email address already exists!');
        event.preventDefault();
    }
    
    else if ((pass == re_pass) && user_check == 0 && email_check == 0) {
        addUser(user, email, pass);
        window.alert('Signed Up!!!');
        event.preventDefault();
        window.location.href = "http://onespotstop.com/";
 
    } 

    else {
        window.alert("Password is incorrect!!!");
        event.preventDefault();
    }
}
