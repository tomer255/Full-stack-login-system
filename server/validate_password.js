const passwordRequirements = require('./config')["password requirements"];

const changePasswordValidation = (password) => {
    if (passwordRequirements["min password length"] <= password.length) {
        return false;
    }

    Object.keys(passwordRequirements.character.settings).map((key) => {
        if (passwordRequirements.character.settings[key]) {
            let re = new RegExp(passwordRequirements.character.regex[key])
            if (!re.test(password)) {
                return false;
            }
        }
    })
    return true
}

module.exports = changePasswordValidation;