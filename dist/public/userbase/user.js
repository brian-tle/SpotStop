class User {
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
}

function createUser() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var re_pass = document.getElementById("repeat_password").value;
    if (pass == re_pass) {
        window.alert('Signed Up!!!');
    }
    else {
        window.alert("Password is incorrect!!!")
    }
}
