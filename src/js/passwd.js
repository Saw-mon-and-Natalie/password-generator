(function() {
    window.addEventListener('load', function(){
        btn = document.getElementById("generate-password")
        btn.addEventListener('click', function(){
            const passwordLength = parseInt(document.getElementById("password-length").value)

            const includeUppercase = document.getElementById("include-uppercase").checked
            const includeLowercase = document.getElementById("include-lowercase").checked
            const includeDigits = document.getElementById("include-digits").checked
            const includeSpecialCharacters = document.getElementById("include-special-characters").checked

            const excludeSimiliarCharacters = document.getElementById("exclude-similiar-characters").checked
            const excludeAmbiguousCharacters = document.getElementById("exclude-ambiguous-characters").checked

            let characters = ''
            characters += includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''
            characters += includeLowercase ? 'abcdefghijklmnopqrstuvwxyz' : ''
            characters += includeDigits ? '0123456789' : ''
            characters += includeSpecialCharacters ? '!@#$%^&*()_+-=[]{}`~;:\'"/?.<>,\\|' : ''

            if( excludeSimiliarCharacters ) {
                characters = characters.replace(/[iIl\|o0O]/g, '')
            }

            let password = ''

            for(let i = 0; i < passwordLength; i++) {
                password += characters[Math.floor(Math.random() * characters.length)]
            }
            const passwordField = document.getElementById("password-field")
            passwordField.textContent = password
        })
    })
})()