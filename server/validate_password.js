const passwordRequirements = require('./config')["password requirements"];


const changePasswordValidation = (req, res, next) => {
    const password = req.body.password || req.body.newPassword
    if (passwordRequirements["min password length"] > password.length) {
        return res.status(400).send(`password must contain more than ${passwordRequirements["min password length"]} characters`);
    }
    let valid = true
    Object.keys(passwordRequirements.character.settings).map((key) => {
        if (passwordRequirements.character.settings[key]) {
            let re = new RegExp(passwordRequirements.character.regex[key])
            if (!re.test(password)) {
                valid = false;
                return res.status(400).send(`password ${key}`);
            }
        }
    });
    if (valid) {
        return next();
    }
}

module.exports = changePasswordValidation;