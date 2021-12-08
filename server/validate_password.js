const passwordRequirements = require('./config')["password requirements"];

const changePasswordValidation = (password) => {
    let valid = true
    if (passwordRequirements["min password length"] > password.length) {
        valid = false;
    }
    Object.keys(passwordRequirements.character.settings).map((key) => {
        if (passwordRequirements.character.settings[key]) {
            let re = new RegExp(passwordRequirements.character.regex[key])
            if (!re.test(password)) {
                valid = false;
            }
        }
    })


    return valid
}

module.exports = changePasswordValidation;