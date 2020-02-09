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


# Screenshots
![Autosuggest Tab Input][Autosuggest Tab Input]

[Autosuggest Tab Input]: https://github.com/ashish-r/tags-autosuggest/blob/master/screenshot.png

