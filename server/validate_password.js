const passwordConfig = require('./password_config');

const changePasswordValidation = (password) => {
    if(passwordConfig["min password length"] <= password.length){
      return false;
    }

    Object.keys(passwordConfig.character.settings).map((key) => {
        if(passwordConfig.character.settings[key]){
          let re = new RegExp(passwordConfig.character.regex[key])
          if(!re.test(password)){
            return false;
          }
        }
      })
      return true
}

module.exports = changePasswordValidation;