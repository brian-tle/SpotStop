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