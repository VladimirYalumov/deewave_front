export default class Validation {
    static validateEmpty(value){
        if (value === "") {
            return "Field must not be empty";
        }
        return "";
    }
    static validateEmail(value) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value)) {
            return "Field is not valid";
        }
        return "";
    }
    static validateLength(value, min, max) {
        if (value.length < min || value.length > max) {
            return "Field must be between " + min +" and " + max +" characters."
        }
        return "";
    }
}