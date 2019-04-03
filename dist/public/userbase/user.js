
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

// function SignUpHandler adds
// new user to the database
// if all the condition satisfies

function SignUpHandler() {
    var user = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("password").value;
    var re_pass = document.getElementById("repeat_password").value;

    if (pass != re_pass) {
        window.alert("Password is incorrect!!!");
        return false;
    }

    addUser(user, email, pass);
    return false;

    // lets user know that the password and
    // the repeated password weren't matching
}
