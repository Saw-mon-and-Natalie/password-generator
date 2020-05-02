!(function(w, d, l, c, a, change, click, checked, value, pInt, length, mathMax, mathMin) {
    let body
    let generatedPasswordWrapper
    let passwordField
    let btn
    let copiedSpan
    
    let closeBtn

    let passwordform
    let backButton
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
        body = d[c]('body')
        generatedPasswordWrapper = d[c]('.generated-password-wrapper')
        passwordField = d[c]("#password-field")
        btn = d[c]("#generate-password")
        copiedSpan = d[c]('.copy')
        
        closeBtn = d[c](".btn-close")

        passwordform = d[c]("form")
        backButton = d[c](".back-button")
        passwordLengthSlider = d[c]("#password-length-slider")
        passwordLengthInput = d[c]("#password-length-input")

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
        leftSide = d[c]("#left")

        shortcutsPanel = d[c](".shortcuts")
        shortcutsPanelIsOpen = false
        keySymbol = d[c]("#key-symbol")
    }

    function loadLocalStorage() {
        config = JSON.parse(l.getItem('c')) || {}
        config.totalMin = pInt(config.totalMin) || 6
        config.totalMax = pInt(config.totalMax) || 1024
        passwordLengthSlider[value] = passwordLengthInput[value] = config.passwordLength = pInt(config.passwordLength) || 16
    
        uppercaseMinInput[value] = config.uppercaseMin = pInt(config.uppercaseMin) || 2
        uppercaseMaxInput[value] = config.uppercaseMax = pInt(config.uppercaseMax) || 1024
    
        lowercaseMinInput[value] = config.lowercaseMin = pInt(config.lowercaseMin) || 2
        lowercaseMaxInput[value] = config.lowercaseMax = pInt(config.lowercaseMax) || 1024
    
        digitsMinInput[value] = config.digitsMin = pInt(config.digitsMin) || 2
        digitsMaxInput[value] = config.digitsMax = pInt(config.digitsMax) || 1024
    
        specialCharactersMinInput[value] = config.specialCharactersMin = pInt(config.specialCharactersMin) || 2
        specialCharactersMaxInput[value] = config.specialCharactersMax = pInt(config.specialCharactersMax) || 1024
    
        config.numShuffles = pInt(config.numShuffles) || 10

        uppercaseInput[checked] = config.includeUppercase = config.includeUppercase == undefined ? true : config.includeUppercase
        lowercaseInput[checked] = config.includeLowercase = config.includeLowercase == undefined ? true : config.includeLowercase
        digitsInput[checked] = config.includeDigits = config.includeDigits == undefined ? true : config.includeDigits
        specialCharactersInput[checked] = config.includeSpecialCharacters = config.includeSpecialCharacters == undefined ? true : config.includeSpecialCharacters

        similiarCharactersInput[checked] = config.excludeSimiliarCharacters = config.excludeSimiliarCharacters == undefined ? true : config.excludeSimiliarCharacters
        ambiguousCharactersInput[checked] = config.excludeAmbiguousCharacters = config.excludeAmbiguousCharacters == undefined ? true : config.excludeAmbiguousCharacters

        saveConfig()
    }

    function saveConfig() {
        l.setItem('c', JSON.stringify(config))
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
            charClasses.u = { u: 0, m: config.uppercaseMax, n: config.uppercaseMin, c: 'ABCDEFGHJKLMNPQRSTUVWXYZ', e: 'IO' }
        }
        if(config.includeLowercase) { 
            charClasses.l = { u: 0, m: config.lowercaseMax, n: config.lowercaseMin, c: 'abcdefghijkmnpqrstuvwxyz', e: 'lo' }
        }
        if(config.includeDigits) { 
            charClasses.d = { u: 0, m: config.digitsMax, n: config.digitsMin, c: '123456789', e: '0' }
        }
        if(config.includeSpecialCharacters) { 
            charClasses.s = { u: 0, m: config.specialCharactersMax, n: config.specialCharactersMin, c: '!@#$%^&*-=_+?', e: '|' }
            if( !config.excludeAmbiguousCharacters ) {
                charClasses.s.c += '()[]{}<>;:.,/\\~'
            }
        }

        if( !config.excludeSimiliarCharacters ) {
            for(let c in charClasses) {
                charClasses[c].c += charClasses[c].e
            }
        }

        let password = ''
        let charClassesWithoutFilledMin = new Set(Object.keys(charClasses))

        while( password[length] < config.passwordLength && charClassesWithoutFilledMin.size > 0 ) {
            charClassesWithoutFilledMin.forEach(function(c) {
                if(charClasses[c].u < charClasses[c].n) {
                    password += pickRandomChar(charClasses[c].c)
                    charClasses[c].u += 1
                } else {
                    charClassesWithoutFilledMin.delete(c)
                }
            })
        }

        let charClassesWithoutFilledMax = new Set(Object.keys(charClasses)) 
        let numCharacters = 0

        for(let c in charClasses) {
            if(charClasses[c].u < charClasses[c].m) {
                numCharacters += charClasses[c].c[length]
            } else {
                charClassesWithoutFilledMax.delete(c)
            }
        }

        while( password[length] < config.passwordLength && charClassesWithoutFilledMax.size > 0 ) {
            let pos = Math.floor(Math.random() * numCharacters)

            for(let c of charClassesWithoutFilledMax) {
                if(pos < charClasses[c].c[length]) {
                    password += charClasses[c].c[pos]
                    charClasses[c].u += 1
                    if(charClasses[c].u >= charClasses[c].m) {
                        charClassesWithoutFilledMax.delete(c)
                        numCharacters -= charClasses[c].c[length]
                    }
                    break
                } else {
                    pos -= charClasses[c].c[length]
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
        return Math.floor(Math.random() * s[length])
    }

    function shuffle(s, n) {
        for(let i = 0; i < n; i++) {
            let shuffled = ''

            while( s[length] > 0) {
                let pos = pickPosition(s)
                shuffled += s[pos]
                s = s.slice(0, pos) + s.slice(pos+1)
            }

            s = shuffled
        }
        return s
    }

    function updatePasswordLength(length) {
        passwordLengthInput[value] = passwordLengthSlider[value] = config.passwordLength = mathMax(mathMin(length, config.totalMax), config.totalMin)
        saveConfig()
    }

    function toggleSettings() {
        body.classList.toggle('settings-open')
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
                updatePasswordLength(pInt(passwordLengthInput[value]) + 1)
                break
            case 109:
            case 189:
                updatePasswordLength(pInt(passwordLengthInput[value]) - 1)
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
                uppercaseInput[checked] = !uppercaseInput[checked]
                config.includeUppercase = uppercaseInput[checked]
                saveConfig()
                break
            case 76:
                lowercaseInput[checked] = !lowercaseInput[checked]
                config.includeLowercase = lowercaseInput[checked]
                saveConfig()
                break
            case 68:
                digitsInput[checked] = !digitsInput[checked]
                config.includeDigits = digitsInput[checked]
                saveConfig()
                break
            case 83:
                specialCharactersInput[checked] = !specialCharactersInput[checked]
                config.includeSpecialCharacters = specialCharactersInput[checked]
                saveConfig()
                break
            case 73:
                similiarCharactersInput[checked] = !similiarCharactersInput[checked]
                config.excludeSimiliarCharacters = similiarCharactersInput[checked]
                saveConfig()
                break
            case 65:
                ambiguousCharactersInput[checked] = !ambiguousCharactersInput[checked]
                config.excludeAmbiguousCharacters = ambiguousCharactersInput[checked]
                saveConfig()
                break
            default:
                break;
        }
    }

    function initEventListeners(){
        btn[a](click, generatePassword)

        passwordform[a]('submit', function(event) {
            event.preventDefault()
            generatePassword()
        })

        closeBtn[a](click, function() {
            generatedPasswordWrapper.style.display = 'none'
        })

        passwordLengthSlider[a](change, function() {
            updatePasswordLength(passwordLengthSlider[value])
            saveConfig()
        })

        passwordLengthInput[a](change, function() {
            updatePasswordLength(passwordLengthInput[value])
            saveConfig()
        })

        uppercaseMinInput[a](change, function() {
            uppercaseMinInput[value] = config.uppercaseMin = mathMin(config.uppercaseMax, pInt(uppercaseMinInput[value]))
            saveConfig()
        })

        uppercaseMaxInput[a](change, function() {
            uppercaseMaxInput[value] = config.uppercaseMax = mathMax(config.uppercaseMin, pInt(uppercaseMaxInput[value]))
            saveConfig()
        })

        lowercaseMinInput[a](change, function() {
            lowercaseMinInput[value] = config.lowercaseMin = mathMin(config.lowercaseMax, pInt(lowercaseMinInput[value]))
            saveConfig()
        })

        lowercaseMaxInput[a](change, function() {
            lowercaseMaxInput[value] = config.lowercaseMax = mathMax(config.lowercaseMin, pInt(lowercaseMaxInput[value]))
            saveConfig()
        })

        digitsMinInput[a](change, function() {
            digitsMinInput[value] = config.digitsMin = mathMin(config.digitsMax, pInt(digitsMinInput[value]))
            saveConfig()
        })

        digitsMaxInput[a](change, function() {
            digitsMaxInput[value] = config.digitsMax = mathMax(config.digitsMin, pInt(digitsMaxInput[value]))
            saveConfig()
        })

        specialCharactersMinInput[a](change, function() {
            specialCharactersMinInput[value] = config.specialCharactersMin = mathMin(config.specialCharactersMax, pInt(specialCharactersMinInput[value]))
            saveConfig()
        })

        specialCharactersMaxInput[a](change, function() {
            specialCharactersMaxInput[value] = config.specialCharactersMax = mathMax(config.specialCharactersMin, pInt(specialCharactersMaxInput[value]))
            saveConfig()
        })

        uppercaseInput[a](change, function() {
            config.includeUppercase = uppercaseInput[checked]
            saveConfig()
        })
        lowercaseInput[a](change, function() {
            config.includeLowercase = lowercaseInput[checked]
            saveConfig()
        })
        digitsInput[a](change, function() {
            config.includeDigits = digitsInput[checked]
            saveConfig()
        })
        specialCharactersInput[a](change, function() {
            config.includeSpecialCharacters = specialCharactersInput[checked]
            saveConfig()
        })
        similiarCharactersInput[a](change, function() {
            config.excludeSimiliarCharacters = similiarCharactersInput[checked]
            saveConfig()
        })
        ambiguousCharactersInput[a](change, function() {
            config.excludeAmbiguousCharacters = ambiguousCharactersInput[checked]
            saveConfig()
        })

        passwordField[a](click, copyPassword)
        keySymbol[a](click, generatePassword)
        settingsIcon[a](click, toggleSettings)
        backButton[a](click, toggleSettings)

        d[a]('keyup', initShortcuts)
    }

    w[a]('DOMContentLoaded', init, false)
})(
    window, 
    document, 
    localStorage, 
    'querySelector', 
    'addEventListener', 
    'change', 
    'click', 
    'checked', 
    'value',
    parseInt,
    'length',
    Math.max,
    Math.min
)