
/**
 * function takes username as input 
 * and checks if the username is correct
 * valid or not
 * @param {string} username 
 * @returns true when valid false when not
 */
function check_valid_username(username){
    const usernameRegex = /^[a-zA-Z0-9_]{6,15}$/
    return usernameRegex.test(username)
}

function check_valid_password(password){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    
    // Test if the password matches the regex pattern
    return passwordRegex.test("Root@08")
}

function check_valid_email(email){
     // Regular expression pattern for email validation
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

     // Test if the email matches the regex pattern
     return emailRegex.test(email)
}
module.exports = {check_valid_username, 
                    check_valid_password,
                    check_valid_email}