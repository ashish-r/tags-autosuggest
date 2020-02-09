class AutoSuggestTagInput {
    constructor(input, dataSet, labelKey, valueKey, shouldSerachValue) {
        this.__value__ = []
        this._previousSearchText
        this._previousDataSet = []
        this._dataSet = dataSet
        this._labelKey = labelKey
        this._valueKey = valueKey
        this._shouldSerachValue = shouldSerachValue
        this.input = input
        // Create wrapper container
        this.autoSuggestContainer = this._createElement('div', 'autosuggest-container')
        // Linking value for easy access
        this.autoSuggestContainer.value = this.value
        // Wrap given input inside a div
        this.input.parentNode.insertBefore(this.autoSuggestContainer, this.input)
        // Create suggestion container
        this.suggestionContainer = this._createElement('div', 'suggestion-container')
        // Create container for input
        this.inputContainer = this._createElement('div', 'input-container')
        // Add onClick event listener for click on tags close
        this.inputContainer.addEventListener('click', this._inputContainerClickHandler)
        // Add onClick event for suggetions
        this.suggestionContainer.addEventListener('click', this._suggestionClickHandler)
        this._debouncedShowSuggestion = this._debounce(this._showSuggestion, 300)
        // On key up event in input field
        this.input.addEventListener('keyup', this._handleInput)
        // On input blur hide suggestion
        this.input.addEventListener('blur', this._hideSuggestion)
        this.inputContainer.appendChild(this.input)
        this.autoSuggestContainer.appendChild(this.inputContainer)
        this.autoSuggestContainer.appendChild(this.suggestionContainer)
    }
    get value () {
        return this.__value__
    }

    // Click event handler on input container to remove tags
    _inputContainerClickHandler = (event) => {
        if (
            (event.target.tagName.toLowerCase() === 'span') && 
            (event.target.getAttribute('class') === 'close-btn')
        ) {
            const node = event.target.parentNode
            node && this._removeTag(node)
        }
        else if (event.target === this.inputContainer) {
            event.stopPropagation()
            this.input.focus()
        }
    }

    // Append tag and update value
    _addTag (label, value) {
        this.value.push(value)
        this.inputContainer.insertBefore(
            this._createTag(label, value),
            this.input
        )
        this._hideSuggestion()
        this.input.focus()
    }

    // Remove tag
    _removeTag(node) {
        const value = node.getAttribute('data-value')
        this.value.splice(this.value.indexOf(value), 1)
        node.remove()
        this.input.focus()
    }

    // Create tag element
    _createTag (label, value) {
        const div = this._createElement('div', 'tag')
        const span = this._createElement('span', 'tag-label', label)
        const closeIcon = this._createElement('span', 'close-btn', 'x')
        div.setAttribute('data-label', label)
        div.setAttribute('data-value', value)
        div.appendChild(span)
        div.appendChild(closeIcon)
        return div;
    }

    // Create suggestion element
    _createSuggestion (label, value) {
        const div = this._createElement('div', 'suggestion', label)
        div.setAttribute('data-label', label)
        div.setAttribute('data-value', value)
        return div
    }

    // Focus suggestion on key down or key up
    _focusSuggestion(keyCode) {
        const suggestions = this.suggestionContainer.children
        if (suggestions) {
            const currentFocusedIndex = Array.prototype.findIndex.call(
                suggestions,
                node => (node.getAttribute('class') || '').includes('active')
            )
            let indexToFocus = 0
            if(currentFocusedIndex !== -1){
                if(keyCode === 13) {
                    const label = suggestions[currentFocusedIndex].getAttribute('data-label')
                    const value = suggestions[currentFocusedIndex].getAttribute('data-value')
                    if (label && value) {
                        this._addTag(label, value)
                    }
                }
                else if (keyCode === 40) {
                    indexToFocus = ((currentFocusedIndex + 1) >= (suggestions.length - 1)) ? 
                        suggestions.length - 1 :
                        currentFocusedIndex + 1
                }
                else if( keyCode ===38 ){
                    indexToFocus = currentFocusedIndex - 1 <= 0 ? 0 : currentFocusedIndex - 1
                }
                suggestions[currentFocusedIndex].setAttribute('class', 'suggestion')              
            }
            suggestions[indexToFocus] && suggestions[indexToFocus].setAttribute('class', 'suggestion active')
        }
    }

    // Get data for suggestions
    _getSuggestionsData (str) {
        const serachText = str.trim().toLowerCase() || null
        // If new search text is subset of previous search text use previously filtered dataset
        const dataStore = (serachText && serachText.includes(this._previousSearchText)) ?
            this._previousDataSet:
            this._dataSet
        const out = serachText ?
            dataStore.filter(
                ({
                    [this._labelKey]: label,
                    [this._valueKey]: value
                }) => !this.value.includes(value) && 
                    `${label}|${this._shouldSerachValue ? value : ''}`.toLowerCase().includes(serachText)
            ) :
            []
        this._previousSearchText = serachText
        this._previousDataSet = out
        return out
    }

    // show suggestion
    _showSuggestion = () => {
        const fragment = document.createDocumentFragment()
        const dataToDisplay = this._getSuggestionsData(this.input.value)
        if(dataToDisplay.length) {
            dataToDisplay.forEach(
                ({
                    [this._labelKey]: label,
                    [this._valueKey]: value
                }) => fragment.appendChild(this._createSuggestion(label, value))
            )
        }
        else if(this.input.value) {
            fragment.appendChild(
                this._createElement('div', 'no-suggestion', 'Data not found')
            )
        }
        this.suggestionContainer.innerHTML = ''
        this.suggestionContainer.appendChild(fragment)
    }

    // input key up handler
    _handleInput = (event) => {
        // down 40 up 38 return 13 backspace 8
        if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13) {
            if(
                this.suggestionContainer.children.length && 
                (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 13)
            ) {
                this._focusSuggestion(event.keyCode)
            }
        }
        else if (this.value.length && (event.keyCode === 8)) {
            const lastTag = this.inputContainer.children[this.value.length - 1]
            if (lastTag) {
                const currentClass = lastTag.getAttribute('class')
                if(currentClass.includes('active')) {
                    this._removeTag(lastTag)
                }
                else{
                    lastTag.setAttribute('class', `${currentClass} active`)
                }
            }
        }
        else{
            this._debouncedShowSuggestion()
        }
    }

    // Click handler for suggestion
    _suggestionClickHandler = (event) => {
        const label = event.target.getAttribute('data-label')
        const value = event.target.getAttribute('data-value')
        if (label && value) {
            this._addTag(label, value)
        }
    }

    _hideSuggestion = () => {
        this.input.value = ''
        // Adding timeout to give user feedback impression
        setTimeout(() => {
            this.suggestionContainer.innerHTML = ''
        }, 250)
    }

    // Helper function to create element
    _createElement(element, className, innerHTML) {
        const el = document.createElement(element)
        className && el.setAttribute('class', className)
        el.innerHTML = innerHTML || ''
        return el
    }

    // Helper function to debounce
    _debounce (func, delay) {
        let debounceTimer
        return function(...args) {
            clearTimeout(debounceTimer) 
            debounceTimer = setTimeout(func.bind(this, ...args), delay) 
        } 
    }
}
