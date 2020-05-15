# tags-autosuggest
An auto suggest tags input in vanillajs. 


Demo: http://ashish-r.github.io/tags-autosuggest

# How To
Just include the index.js file in your project and convert any input field into autosuggest tags input.

` <input id ="autosuggest-input" />  `

    new AutoSuggestTagInput(
        document.getElementById('autosuggest-input'), // Input element
        dataSet, // Data set an array of objects
        'labelKey',
        'valueKey',
         true // Should also serach keys
    )

# Features
1. On typing a letter the relevant suggestions appear on the list.

2. On clicking up / down arrow suggestions get highlight

3. Select Suggestion with mouse click or enter.

4. On selecting on the option in the list it gets tagged in the search bar.

5. On clicking the cross on the tagged item, it gets removed from the search bar

6. If there is no term in search bar and if you press backspace the last tagged item gets highlight. On another backspace press the last tagged item gets deleted.


# Screenshots
![Autosuggest Tab Input][Autosuggest Tab Input]

[Autosuggest Tab Input]: https://github.com/ashish-r/tags-autosuggest/blob/master/screenshot.png

