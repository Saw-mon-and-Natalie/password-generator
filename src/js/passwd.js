!(function(w, d, l, c, a) {
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

    let config

    function init() {
        initFields()
        loadLocalStorage()
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

    function loadLocalStorage() {
        config = JSON.parse(l.getItem('config')) || {}
        config.totalMin = parseInt(config.totalMin) || 6
        config.totalMax = parseInt(config.totalMax) || 1024
        passwordLengthSlider.value = passwordLengthInput.value = config.passwordLength = parseInt(config.passwordLength) || 16
    
        uppercaseMinInput.value = config.uppercaseMin = parseInt(config.uppercaseMin) || 2
        uppercaseMaxInput.value = config.uppercaseMax = parseInt(config.uppercaseMax) || 1024
    
        lowercaseMinInput.value = config.lowercaseMin = parseInt(config.lowercaseMin) || 2
        lowercaseMaxInput.value = config.lowercaseMax = parseInt(config.lowercaseMax) || 1024
    
        digitsMinInput.value = config.digitsMin = parseInt(config.digitsMin) || 2
        digitsMaxInput.value = config.digitsMax = parseInt(config.digitsMax) || 1024
    
        specialCharactersMinInput.value = config.specialCharactersMin = parseInt(config.specialCharactersMin) || 2
        specialCharactersMaxInput.value = config.specialCharactersMax = parseInt(config.specialCharactersMax) || 1024
    
        config.numShuffles = parseInt(config.numShuffles) || 10

        uppercaseInput.checked = config.includeUppercase = config.includeUppercase || false
        lowercaseInput.checked = config.includeLowercase = config.includeLowercase || false
        digitsInput.checked = config.includeDigits = config.includeDigits || false
        specialCharactersInput.checked = config.includeSpecialCharacters = config.includeSpecialCharacters || false

        similiarCharactersInput.checked = config.excludeSimiliarCharacters = config.excludeSimiliarCharacters || false
        ambiguousCharactersInput.checked = config.excludeAmbiguousCharacters = config.excludeAmbiguousCharacters || false

        saveConfig()
    }

    function saveConfig() {
        l.setItem('config', JSON.stringify(config))
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

        let charClasses = {}
        if(config.includeUppercase) {
            charClasses.uppercase = { used: 0, max: config.uppercaseMax, min: config.uppercaseMin, chars: 'ABCDEFGHJKLMNPQRSTUVWXYZ', extraChars: 'IO' }

        }
        if(config.includeLowercase) { 
            charClasses.lowercase = { used: 0, max: config.lowercaseMax, min: config.lowercaseMin, chars: 'abcdefghijkmnpqrstuvwxyz', extraChars: 'lo' }
        }
        if(config.includeDigits) { 
            charClasses.digits = { used: 0, max: config.digitsMax, min: config.digitsMin, chars: '123456789', extraChars: '0' }
        }
        if(config.includeSpecialCharacters) { 
            charClasses.special = { used: 0, max: config.specialCharactersMax, min: config.specialCharactersMin, chars: '!@#$%^&*-=_+?', extraChars: '|' }
            if( !config.excludeAmbiguousCharacters ) {
                charClasses.special.chars += '()[]{}<>;:.,/\\~'
            }
        }

        if( !config.excludeSimiliarCharacters ) {
            for(let c in charClasses) {
                charClasses[c].chars += charClasses[c].extraChars
            }
        }

        let password = ''
        let charClassesWithoutFilledMin = new Set(Object.keys(charClasses))

        while( password.length < config.passwordLength && charClassesWithoutFilledMin.size > 0 ) {
            charClassesWithoutFilledMin.forEach(function(c) {
                if(charClasses[c].used < charClasses[c].min) {
                    password += pickRandomChar(charClasses[c].chars)
                    charClasses[c].used += 1
                } else {
                    charClassesWithoutFilledMin.delete(c)
                }
            })
        }

        let charClassesWithoutFilledMax = new Set(Object.keys(charClasses)) 
        let numCharacters = 0

        for(let c in charClasses) {
            if(charClasses[c].used < charClasses[c].max) {
                numCharacters += charClasses[c].chars.length
            } else {
                charClassesWithoutFilledMax.delete(c)
            }
        }

        while( password.length < config.passwordLength && charClassesWithoutFilledMax.size > 0 ) {
            let pos = Math.floor(Math.random() * numCharacters)

            for(let c of charClassesWithoutFilledMax) {
                if(pos < charClasses[c].chars.length) {
                    password += charClasses[c].chars[pos]
                    charClasses[c].used += 1
                    if(charClasses[c].used >= charClasses[c].max) {
                        charClassesWithoutFilledMax.delete(c)
                        numCharacters -= charClasses[c].chars.length
                    }
                    break
                } else {
                    pos -= charClasses[c].chars.length
                }
            }
        }
        
        password = shuffle(password, config.numShuffles)
        passwordField.textContent = password
        generatedPasswordWrapper.style.display = 'flex'
    }

    function pickRandomChar(s) {
        return s[pickPosition(s)]
    }

    function pickPosition(s) {
        return Math.floor(Math.random() * s.length)
    }

    function shuffle(s, n) {
        for(let i = 0; i < n; i++) {
            let shuffled = ''

            while( s.length > 0) {
                let pos = pickPosition(s)
                shuffled += s[pos]
                s = s.slice(0, pos) + s.slice(pos+1)
            }

            s = shuffled
        }
        return s
    }

    function updatePasswordLength(length) {
        passwordLengthInput.value = passwordLengthSlider.value = config.passwordLength = Math.max(Math.min(length, config.totalMax), config.totalMin)
        saveConfig()
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
                config.includeUppercase = uppercaseInput.checked
                saveConfig()
                break
            case 76:
                lowercaseInput.checked = !lowercaseInput.checked
                config.includeLowercase = lowercaseInput.checked
                saveConfig()
                break
            case 68:
                digitsInput.checked = !digitsInput.checked
                config.includeDigits = digitsInput.checked
                saveConfig()
                break
            case 83:
                specialCharactersInput.checked = !specialCharactersInput.checked
                config.includeSpecialCharacters = specialCharactersInput.checked
                saveConfig()
                break
            case 73:
                similiarCharactersInput.checked = !similiarCharactersInput.checked
                config.excludeSimiliarCharacters = similiarCharactersInput.checked
                saveConfig()
                break
            case 65:
                ambiguousCharactersInput.checked = !ambiguousCharactersInput.checked
                config.excludeAmbiguousCharacters = ambiguousCharactersInput.checked
                saveConfig()
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
            saveConfig()
        })

        passwordLengthInput[a]('change', function() {
            updatePasswordLength(passwordLengthInput.value)
            saveConfig()
        })

        uppercaseMinInput[a]('change', function() {
            uppercaseMinInput.value = config.uppercaseMin = Math.min(config.uppercaseMax, parseInt(uppercaseMinInput.value))
            saveConfig()
        })

        uppercaseMaxInput[a]('change', function() {
            uppercaseMaxInput.value = config.uppercaseMax = Math.max(config.uppercaseMin, parseInt(uppercaseMaxInput.value))
            saveConfig()
        })

        lowercaseMinInput[a]('change', function() {
            lowercaseMinInput.value = config.lowercaseMin = Math.min(config.lowercaseMax, parseInt(lowercaseMinInput.value))
            saveConfig()
        })

        lowercaseMaxInput[a]('change', function() {
            lowercaseMaxInput.value = config.lowercaseMax = Math.max(config.lowercaseMin, parseInt(lowercaseMaxInput.value))
            saveConfig()
        })

        digitsMinInput[a]('change', function() {
            digitsMinInput.value = config.digitsMin = Math.min(config.digitsMax, parseInt(digitsMinInput.value))
            saveConfig()
        })

        digitsMaxInput[a]('change', function() {
            digitsMaxInput.value = config.digitsMax = Math.max(config.digitsMin, parseInt(digitsMaxInput.value))
            saveConfig()
        })

        specialCharactersMinInput[a]('change', function() {
            specialCharactersMinInput.value = config.specialCharactersMin = Math.min(config.specialCharactersMax, parseInt(specialCharactersMinInput.value))
            saveConfig()
        })

        specialCharactersMaxInput[a]('change', function() {
            specialCharactersMaxInput.value = config.specialCharactersMax = Math.max(config.specialCharactersMin, parseInt(specialCharactersMaxInput.value))
            saveConfig()
        })

        uppercaseInput[a]('change', function() {
            config.includeUppercase = uppercaseInput.checked
            saveConfig()
        })
        lowercaseInput[a]('change', function() {
            config.includeLowercase = lowercaseInput.checked
            saveConfig()
        })
        digitsInput[a]('change', function() {
            config.includeDigits = digitsInput.checked
            saveConfig()
        })
        specialCharactersInput[a]('change', function() {
            config.includeSpecialCharacters = specialCharactersInput.checked
            saveConfig()
        })
        similiarCharactersInput[a]('change', function() {
            config.excludeSimiliarCharacters = similiarCharactersInput.checked
            saveConfig()
        })
        ambiguousCharactersInput[a]('change', function() {
            config.excludeAmbiguousCharacters = ambiguousCharactersInput.checked
            saveConfig()
        })

        passwordField[a]('click', copyPassword)
        keySymbol[a]('click', generatePassword)
        settingsIcon[a]('click', toggleSettings)

        d[a]('keyup', initShortcuts)
    }

    w[a]('DOMContentLoaded', init, false)
})(window, document, localStorage, 'querySelector', 'addEventListener')