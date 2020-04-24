(function(w, d, c) {
    const lib = {
        init: function() {
            this.initFields()
            this.initEventListeners()
        },
        initFields: function() {
            this.generatedPasswordWrapper = d[c]('.generated-password-wrapper')
            this.passwordField = d[c]("#password-field")
            this.btn = d[c]("#generate-password")
            this.copiedSpan = d[c]('.copy')
            this.passwordLengthInput = d[c]("#password-length")
            this.closeBtn = d[c](".btn-close")
            this.shortcutsPanel = d[c]("ul.shortcuts")

            this.passwordform = d[c]("#password-form")
            this.passwordLengthSlider = d[c]("#password-length-slider")

            this.uppercaseInput = d[c]("#include-uppercase")
            this.lowercaseInput = d[c]("#include-lowercase")
            this.digitsInput = d[c]("#include-digits")
            this.specialCharactersInput = d[c]("#include-special-characters")

            this.similiarCharactersInput = d[c]("#exclude-similiar-characters")
            this.ambiguousCharactersInput = d[c]("#exclude-ambiguous-characters")

            this.settingsIcon = d[c]("#settings-icon")
            this.leftSide = d[c](".left-side")
            this.main = d[c]("main")
            this.keySymbol = d[c]("#key-symbol")
            console.log(this)
        },
        copyPassword: function() {
            this.selectElement(this.passwordField)
            d.execCommand('copy')
            this.copiedSpan.classList.add('show')
        },
        selectElement: function(el) {
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
        },
        generatePassword: function() {
            this.copiedSpan.classList.remove('show')
    
            const passwordLength = parseInt(this.passwordLengthInput.value)
    
            const includeUppercase = this.uppercaseInput.checked
            const includeLowercase = this.lowercaseInput.checked
            const includeDigits = this.digitsInput.checked
            const includeSpecialCharacters = this.specialCharactersInput.checked
    
            const excludeSimiliarCharacters = this.similiarCharactersInput.checked
            const excludeAmbiguousCharacters = this.ambiguousCharactersInput.checked
    
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
            
            this.passwordField.textContent = password
            this.generatedPasswordWrapper.style.display = 'flex'
        },
        toggleSettings: function () {
            if( this.mainIsClosed ) {
                this.leftSide.style.width = "40%";
                this.main.style.display = "flex";
                this.main.style.opacity = 1;
            } else {
                this.main.style.opacity = 0;
                this.main.style.display = "none";
                this.leftSide.style.width = "100%";
                
            }
            
            this.mainIsClosed = !this.mainIsClosed
        },
        initShortcuts: function(event) {
            switch(event.keyCode) {
                case 27:
                    this.generatedPasswordWrapper.style.display = 'none'
                    break
                case 13:
                    this.generatePassword()
                    break
                case 107:
                case 187: {
                    let newLength = parseInt(this.passwordLengthInput.value) + 1
                    newLength = Math.min(newLength, 1024)
                    newLength = Math.max(6, newLength)
                    this.passwordLengthSlider.value = newLength
                    this.passwordLengthInput.value = newLength
                    break
                }
                case 109:
                case 189: {
                    let newLength = parseInt(this.passwordLengthInput.value) - 1
                    newLength = Math.min(newLength, 1024)
                    newLength = Math.max(6, newLength)
                    this.passwordLengthSlider.value = newLength
                    this.passwordLengthInput.value = newLength
                    break
                }
                case 67:
                    event.ctrlKey && this.copyPassword()
                    break
                case 191:
                    this.shortcutsPanel.style.display = this.shortcutsPanel.style.display == 'none' ? 'block' : 'none'
                    break
                case 85:
                    this.uppercaseInput.checked = !this.uppercaseInput.checked
                    break
                case 76:
                    this.lowercaseInput.checked = !this.lowercaseInput.checked
                    break
                case 68:
                    this.digitsInput.checked = !this.digitsInput.checked
                    break
                case 83:
                    this.specialCharactersInput.checked = !this.specialCharactersInput.checked
                    break
                case 73:
                    this.similiarCharactersInput.checked = !this.similiarCharactersInput.checked
                    break
                case 65:
                    this.ambiguousCharactersInput.checked = !this.ambiguousCharactersInput.checked
                    break
                case 192:
                    this.toggleSettings()
                default:
                    break;
            }
        },
        initEventListeners: function(){
            this.btn.addEventListener('click', this.generatePassword.bind(this))
    
            this.passwordform.addEventListener('submit', (function(event) {
                event.preventDefault()
                this.generatePassword()
            }).bind(this))
    
            this.closeBtn.addEventListener('click', (function() {
                this.generatedPasswordWrapper.style.display = 'none'
            }).bind(this))
    
            this.passwordLengthSlider.addEventListener('change', (function(event) {
                this.passwordLengthInput.value = event.target.value
            }).bind(this))
    
            this.passwordField.addEventListener('click', this.copyPassword.bind(this))
            this.keySymbol.addEventListener('click', this.generatePassword.bind(this))
            this.settingsIcon.addEventListener('click', this.toggleSettings.bind(this))
    
            d.addEventListener('keyup', this.initShortcuts.bind(this))
        },
    }

    w.addEventListener('DOMContentLoaded', lib.init.bind(lib), false)
})(window, document, 'querySelector')