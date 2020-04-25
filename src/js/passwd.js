(function(w, d, c, a) {
    let generatedPasswordWrapper
    let passwordField
    let btn
    let copiedSpan
    
    let closeBtn

    let passwordform
    let passwordLengthSlider
    let passwordLengthInput

    let uppercaseInput
    let lowercaseInput
    let digitsInput
    let specialCharactersInput

    let uppercaseMinInput
    let uppercaseMaxInput
    let lowercaseMinInput
    let lowercaseMaxInput
    let digitsMinInput
    let digitsMaxInput
    let specialCharactersMinInput
    let specialCharactersMaxInput

    let similiarCharactersInput
    let ambiguousCharactersInput

    let settingsIcon
    let leftSide
    let main
    let mainIsClosed
    let shortcutsPanel
    let shortcutsPanelIsOpen
    let keySymbol

    let totalMin = 6
    let totalMax = 1024
    let passwordLength = 16

    let uppercaseMin = 2
    let uppercaseMax = 1024

    let lowercaseMin = 2
    let lowercaseMax = 1024

    let digitsMix = 2
    let digitsMax = 1024

    let specialCharactersMin = 2
    let specialCharactersMax = 1024

    function init() {
        initFields()
        initEventListeners()
    }

    function initFields() {
        generatedPasswordWrapper = d[c]('.generated-password-wrapper')
        passwordField = d[c]("#password-field")
        btn = d[c]("#generate-password")
        copiedSpan = d[c]('.copy')
        
        closeBtn = d[c](".btn-close")

        passwordform = d[c]("#password-form")
        passwordLengthSlider = d[c]("#password-length-slider")
        passwordLengthInput = d[c]("#password-length")

        uppercaseInput = d[c]("#include-uppercase")
        lowercaseInput = d[c]("#include-lowercase")
        digitsInput = d[c]("#include-digits")
        specialCharactersInput = d[c]("#include-special-characters")

        uppercaseMinInput = d[c]("#uppercaseMin")
        uppercaseMaxInput = d[c]("#uppercaseMax")
        lowercaseMinInput = d[c]("#lowercaseMin")
        lowercaseMaxInput = d[c]("#lowercaseMax")
        digitsMinInput = d[c]("#digitsMin")
        digitsMaxInput = d[c]("#digitsMax")
        specialCharactersMinInput = d[c]("#specialCharactersMin")
        specialCharactersMaxInput = d[c]("#specialCharactersMax")

        similiarCharactersInput = d[c]("#exclude-similiar-characters")
        ambiguousCharactersInput = d[c]("#exclude-ambiguous-characters")

        settingsIcon = d[c]("#settings-icon")
        leftSide = d[c](".left-side")
        main = d[c]("main")
        mainIsClosed = true
        shortcutsPanel = d[c]("ul.shortcuts")
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

        const includeUppercase = uppercaseInput.checked
        const includeLowercase = lowercaseInput.checked
        const includeDigits = digitsInput.checked
        const includeSpecialCharacters = specialCharactersInput.checked

        const excludeSimiliarCharacters = similiarCharactersInput.checked
        const excludeAmbiguousCharacters = ambiguousCharactersInput.checked

        
        let uppercaseCharacters  = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
        let lowercaseCharacters = 'abcdefghijkmnpqrstuvwxyz'
        let digitCharacters = '123456789'
        let specialCharacters = '!@#$%^&*-=_+?'

        if( !excludeSimiliarCharacters ) {
            uppercaseCharacters += 'IO'
            lowercaseCharacters += 'lo'
            digitCharacters += '0'
            specialCharacters += '|'
        }

        if( !excludeAmbiguousCharacters ) {
            specialCharacters += '()[]{}<>;:.,/\\~'
        }
        
        let characters = ''
        characters += includeUppercase ? uppercaseCharacters : ''
        characters += includeLowercase ? lowercaseCharacters : ''
        characters += includeDigits ? digitCharacters : ''
        characters += includeSpecialCharacters ? specialCharacters : ''

        

        let password = ''

        for(let i = 0; i < passwordLength; i++) {
            password += characters[Math.floor(Math.random() * characters.length)]
        }
        
        passwordField.textContent = password
        generatedPasswordWrapper.style.display = 'flex'
    }

    function updatePasswordLength(length) {
        passwordLength = Math.max(Math.min(length, totalMax), totalMin)
        passwordLengthSlider.value = passwordLength
        passwordLengthInput.value = passwordLength
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
            case 187:
                updatePasswordLength(parseInt(passwordLengthInput.value) + 1)
                break
            case 109:
            case 189:
                updatePasswordLength(parseInt(passwordLengthInput.value) - 1)
                break
            case 67:
                event.ctrlKey && copyPassword()
                break
            case 191:
                toggleShortcuts()
                break
            case 192:
                toggleSettings()
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

        passwordLengthSlider[a]('change', function() {
            updatePasswordLength(passwordLengthSlider.value)
        })

        passwordLengthInput[a]('change', function() {
            updatePasswordLength(passwordLengthInput.value)
        })

        uppercaseMinInput[a]('change', function() {
            uppercaseMin = Math.min(uppercaseMax, parseInt(uppercaseMinInput.value))
            uppercaseMinInput.value = uppercaseMin
        })

        uppercaseMaxInput[a]('change', function() {
            uppercaseMax = Math.max(uppercaseMin, parseInt(uppercaseMaxInput.value))
            uppercaseMaxInput.value = uppercaseMax
        })

        lowercaseMinInput[a]('change', function() {
            lowercaseMin = Math.min(lowercaseMax, parseInt(lowercaseMinInput.value))
            lowercaseMinInput.value = lowercaseMin
        })

        lowercaseMaxInput[a]('change', function() {
            lowercaseMax = Math.max(lowercaseMin, parseInt(lowercaseMaxInput.value))
            lowercaseMaxInput.value = lowercaseMax
        })

        digitsMinInput[a]('change', function() {
            digitsMin = Math.min(digitsMax, parseInt(digitsMinInput.value))
            digitsMinInput.value = digitsMin
        })

        digitsMaxInput[a]('change', function() {
            digitsMax = Math.max(digitsMin, parseInt(digitsMaxInput.value))
            digitsMaxInput.value = digitsMax
        })

        specialCharactersMinInput[a]('change', function() {
            specialCharactersMin = Math.min(specialCharactersMax, parseInt(specialCharactersMinInput.value))
            specialCharactersMinInput.value = specialCharactersMin
        })

        specialCharactersMaxInput[a]('change', function() {
            specialCharactersMax = Math.max(specialCharactersMin, parseInt(specialCharactersMaxInput.value))
            specialCharactersMaxInput.value = specialCharactersMax
        })

        passwordField[a]('click', copyPassword)
        keySymbol[a]('click', generatePassword)
        settingsIcon[a]('click', toggleSettings)

        d[a]('keyup', initShortcuts)
    }

    w[a]('DOMContentLoaded', init, false)
})(window, document, 'querySelector', 'addEventListener')