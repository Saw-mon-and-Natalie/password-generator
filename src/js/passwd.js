(function(w, d, c, a) {
    let generatedPasswordWrapper
    let passwordField
    let btn
    let copiedSpan
    let passwordLengthInput
    let closeBtn
    let shortcutsPanel
    let passwordform
    let passwordLengthSlider
    let uppercaseInput
    let lowercaseInput
    let digitsInput
    let specialCharactersInput
    let similiarCharactersInput
    let ambiguousCharactersInput
    let settingsIcon
    let leftSide
    let main
    let mainIsClosed
    let shortcutsPanelIsOpen
    let keySymbol

    function init() {
        initFields()
        initEventListeners()
    }

    function initFields() {
        generatedPasswordWrapper = d[c]('.generated-password-wrapper')
        passwordField = d[c]("#password-field")
        btn = d[c]("#generate-password")
        copiedSpan = d[c]('.copy')
        passwordLengthInput = d[c]("#password-length")
        closeBtn = d[c](".btn-close")
        shortcutsPanel = d[c]("ul.shortcuts")

        passwordform = d[c]("#password-form")
        passwordLengthSlider = d[c]("#password-length-slider")

        uppercaseInput = d[c]("#include-uppercase")
        lowercaseInput = d[c]("#include-lowercase")
        digitsInput = d[c]("#include-digits")
        specialCharactersInput = d[c]("#include-special-characters")

        similiarCharactersInput = d[c]("#exclude-similiar-characters")
        ambiguousCharactersInput = d[c]("#exclude-ambiguous-characters")

        settingsIcon = d[c]("#settings-icon")
        leftSide = d[c](".left-side")
        main = d[c]("main")
        mainIsClosed = true
        shortcutsPanelIsOpen = false
        keySymbol = d[c]("#key-symbol")
    }

    function copyPassword() {
        selectElement(passwordField)
        d.execCommand('copy')
        copiedSpan.classList.add('show')
    }

    function selectElement(el) {
        if( w.getSelection) {
            const sel = w.getSelection()
            sel.removeAllRanges()
            const range = d.createRange()
            range.selectNodeContents(el)
            sel.addRange(range)
        } else if (d.selection) {
            const textRange = d.body.createTextRange()
            textRange.moveToElementText(el)
            textRange.select()
        }
    }

    function generatePassword() {
        copiedSpan.classList.remove('show')

        const passwordLength = parseInt(passwordLengthInput.value)

        const includeUppercase = uppercaseInput.checked
        const includeLowercase = lowercaseInput.checked
        const includeDigits = digitsInput.checked
        const includeSpecialCharacters = specialCharactersInput.checked

        const excludeSimiliarCharacters = similiarCharactersInput.checked
        const excludeAmbiguousCharacters = ambiguousCharactersInput.checked

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
        
        passwordField.textContent = password
        generatedPasswordWrapper.style.display = 'flex'
    }

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

    function toggleShortcuts() {
        console.log(this)
        shortcutsPanel.style.display = shortcutsPanelIsOpen ? 'none' : 'block'
        shortcutsPanelIsOpen = !shortcutsPanelIsOpen
    }

    function initShortcuts(event) {
        switch(event.keyCode) {
            case 27:
                generatedPasswordWrapper.style.display = 'none'
                break
            case 13:
                generatePassword()
                break
            case 107:
            case 187: {
                let newLength = parseInt(passwordLengthInput.value) + 1
                newLength = Math.min(newLength, 1024)
                newLength = Math.max(6, newLength)
                passwordLengthSlider.value = newLength
                passwordLengthInput.value = newLength
                break
            }
            case 109:
            case 189: {
                let newLength = parseInt(passwordLengthInput.value) - 1
                newLength = Math.min(newLength, 1024)
                newLength = Math.max(6, newLength)
                passwordLengthSlider.value = newLength
                passwordLengthInput.value = newLength
                break
            }
            case 67:
                event.ctrlKey && copyPassword()
                break
            case 191:
                toggleShortcuts()
                break
            case 85:
                uppercaseInput.checked = !uppercaseInput.checked
                break
            case 76:
                lowercaseInput.checked = !lowercaseInput.checked
                break
            case 68:
                digitsInput.checked = !digitsInput.checked
                break
            case 83:
                specialCharactersInput.checked = !specialCharactersInput.checked
                break
            case 73:
                similiarCharactersInput.checked = !similiarCharactersInput.checked
                break
            case 65:
                ambiguousCharactersInput.checked = !ambiguousCharactersInput.checked
                break
            case 192:
                toggleSettings()
            default:
                break;
        }
    }

    function initEventListeners(){
        btn[a]('click', generatePassword)

        passwordform[a]('submit', function(event) {
            event.preventDefault()
            generatePassword()
        })

        closeBtn[a]('click', function() {
            generatedPasswordWrapper.style.display = 'none'
        })

        passwordLengthSlider[a]('change', function(event) {
            passwordLengthInput.value = event.target.value
        })

        passwordField[a]('click', copyPassword)
        keySymbol[a]('click', generatePassword)
        settingsIcon[a]('click', toggleSettings)

        d[a]('keyup', initShortcuts)
    }

    w[a]('DOMContentLoaded', init, false)
})(window, document, 'querySelector', 'addEventListener')