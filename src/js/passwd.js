(function() {
    function selectElement(el) {
        if( window.getSelection) {
            const sel = window.getSelection()
            sel.removeAllRanges()
            const range = document.createRange()
            range.selectNodeContents(el)
            sel.addRange(range)
        } else if (document.selection) {
            const textRange = document.body.createTextRange()
            textRange.moveToElementText(el)
            textRange.select()
        }
    }

    function copyPassword() {
        const passwordField = document.getElementById("password-field")
        const copiedSpan = document.querySelector('.copy')
        selectElement(passwordField)
        document.execCommand('copy')

        copiedSpan.classList.add('show')
    }

    function generatePassword() {
        const copiedSpan = document.querySelector('.copy')
        copiedSpan.classList.remove('show')

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

        const passwordGeneratorWrapper = document.querySelector('.generated-password-wrapper')
        passwordGeneratorWrapper.style.display = 'flex'
    }

    window.addEventListener('load', function(){
        const btn = document.getElementById("generate-password")
        btn.addEventListener('click', generatePassword)

        const closeBtn = document.querySelector(".btn-close")
        const generatedPasswordWrapper = document.querySelector('.generated-password-wrapper')
        const passwordLengthSlider = document.getElementById("password-length-slider")
        const passwordLength = document.getElementById("password-length")
        const passwordField = document.getElementById("password-field")
        const shortcutsPanel = document.querySelector("ul.shortcuts")

        const uppercase = document.getElementById("include-uppercase")
        const lowercase = document.getElementById("include-lowercase")
        const digits = document.getElementById("include-digits")
        const specialCharacters = document.getElementById("include-special-characters")

        const similiarCharacters = document.getElementById("exclude-similiar-characters")
        const ambiguousCharacters = document.getElementById("exclude-ambiguous-characters")

        const passwordform = document.getElementById("password-form")

        const settingsIcon = document.getElementById("settings-icon")
        const leftSide = document.querySelector(".left-side")
        const main = document.querySelector("main")
        let mainIsClosed = true

        const keySymbol = document.getElementById("key-symbol")

        passwordform.addEventListener('submit', function(event) {
            event.preventDefault()

            generatePassword()
        })

        closeBtn.addEventListener('click', function() {
            generatedPasswordWrapper.style.display = 'none'
        })

        passwordLengthSlider.addEventListener('change', function(event) {
            passwordLength.value = event.target.value
        })

        passwordField.addEventListener('click', function() {
            copyPassword()
        })

        keySymbol.addEventListener('click', generatePassword)

        function toggleSettings() {
            if( mainIsClosed ) {
                leftSide.style.width = "40%";
                main.style.display = "flex";
                main.style.opacity = 1;
            } else {
                main.style.opacity = 0;
                main.style.display = "none";
                leftSide.style.width = "100%";
                
            }
            
            mainIsClosed = !mainIsClosed
        }

        settingsIcon.addEventListener('click', toggleSettings)


        document.addEventListener('keyup', function(event) {
            if(event.key == "Escape" || event.keyCode == 27) {
                generatedPasswordWrapper.style.display = 'none'
            } else if(event.key == "Enter" || event.keyCode == 13) {
                generatePassword()
            } else if( event.key == "=" || event.key == "+" || event.keyCode == 187 || event.keyCode == 107) {
                let newLength = parseInt(passwordLength.value) + 1
                newLength = Math.min(newLength, 1024)
                newLength = Math.max(6, newLength)
                passwordLengthSlider.value = newLength
                passwordLength.value = newLength
            } else if( event.key == "-" || event.key == "_" || event.keyCode == 189 || event.keyCode == 109) {
                let newLength = parseInt(passwordLength.value) - 1
                newLength = Math.min(newLength, 1024)
                newLength = Math.max(6, newLength)
                passwordLengthSlider.value = newLength
                passwordLength.value = newLength
            } else if( event.keyCode == 67 && event.ctrlKey) {
                copyPassword()
            } else if( event.keyCode == 191 ) {
                shortcutsPanel.style.display = shortcutsPanel.style.display == 'none' ? 'block' : 'none'
            } else if ( event.keyCode == 85 ) {
                uppercase.checked = !uppercase.checked
            } else if ( event.keyCode == 76 ) {
                lowercase.checked = !lowercase.checked
            } else if ( event.keyCode == 68 ) {
                digits.checked = !digits.checked
            } else if ( event.keyCode == 83 ) {
                specialCharacters.checked = !specialCharacters.checked
            } else if ( event.keyCode == 73 ) {
                similiarCharacters.checked = !similiarCharacters.checked
            } else if ( event.keyCode == 65 ) {
                ambiguousCharacters.checked = !ambiguousCharacters.checked
            } else if ( event.keyCode == 192 ) {
                toggleSettings()
            }


            console.log(event)
        })
    })
})()