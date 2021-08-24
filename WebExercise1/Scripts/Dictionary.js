const urlDict = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

function onStartSearch() {
    var tagInput = $('#inputDictWord');
    var input = tagInput.val().trim();
    tagInput.val('');

    var tagOutput = $('#divOutput');
    tagOutput.empty()

    var outputMsg = $('#outputMessage');
    outputMsg.css("background-color", "lightgoldenrodyellow");

    var savedWords = $('#dsSavedWords');

    var urlDictWord = `${urlDict}${input}`

    $.ajax({
        url: urlDictWord,
        type: "GET",
        contextType: "text/plain",
        success: function (dictionary) {
            tagOutput.css("display", "flex");
            outputMsg.val(`Word Located: ${input}`);

            var dup = IsDataListDuplicated(input);
            if (dup == false ) {
                savedWords.append(`<option value="${input}">${input}</option>`);
            };

            extractData(dictionary, tagOutput);

            
        },
        error: function (xhr, status, error) {
            tagOutput.css("display", "none");
            outputMsg.val(`Unable to locate word: ${input}`);
            outputMsg.css("background-color", "yellow");
        }
    });


}

function onClearSearch() {
    var tagInput = $('#inputDictWord');
    tagInput.val('')

    var outputMsg = $('#outputMessage');
    outputMsg.val('');
    outputMsg.css("background-color", "lightgoldenrodyellow");
}


function extractData(data, tagOutput) {
    console.log(data);

    var htmlTag = '';

    var defCnt;
    var word;
    var partOfSpeeh;
    var definition;
    var example;
    var synonyms;

    $.each(data, function (index, value) {
        defCnt = index + 1;
        word = value.word;

        partOfSpeeh = '';
        $.each(value.meanings, function (index, value) {

            partOfSpeech = value.partOfSpeech;
            htmlTag = `
                        <div style="flex: 1; display: flex; flex-direction: column; border: 1px solid black; border-radius: 6px; margin-bottom: 10px;">
                            <div style="flex: 1; display: flex; flex-direction: row; background-color: lightgray; color: blue; border-radius: 6px 6px 0 0; border-bottom: 1px solid black; padding: 5px; white-space: nowrap;">
                                <label style="flex: 0; margin-right: 20px; font-weight: bold">Definition #${defCnt}</label>
                                <label style="flex: 0; margin-right: 5px; font-weight: bold; color: black;"> Word: </label>
                                <label style="flex: 0; margin-right: 20px; font-weight: normal">${word}</label>
                                <label style="flex: 1"><!-- filler --></label>
                            </div>`;

            htmlTag += `
                        <div style="flex: 1; display: flex; flex-direction: row; white-space: nowrap; padding: 10px 10px 3px 10px;">
                            <label style="flex: 0; font-weight:bold; margin-right: 5px;">Part of Speech:</label>
                            <label style="flex: 0; font-weight:normal; color: blue;"><i>${partOfSpeech}</i></label>
                            <label style="flex: 1"><!-- filler --></label>
                        </div>`;

            htmlTag += `
                            <div style="flex: 1; display: flex; flex-direction: row; margin:10px 10px 0 10px; word-break: break-all">
                                <label style="flex: 0 0 150px; margin-bottom: 0;"><!-- filler --></label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px; font-weight: bold; background-color: lightgray; border-top: 1px solid black; border-left: 1px solid black; border-radius: 5px 0 0 0;" title="Definitions">Definitions</label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px; font-weight: bold; background-color: lightgray; border-top: 1px solid black; border-left: 1px solid black;" title="Examples">Examples</label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px; font-weight: bold; background-color: lightgray; border-top: 1px solid black; border-left: 1px solid black; border-right: 1px solid black;  border-radius: 0 5px 0 0;" title="synonyms">Synonyms</label>
                            </div>`;



            definition = '';
            $.each(value.definitions, function (index, value) {
                definition = value.definition;
                example = value.example;
                if (example == null || example == 'undefined' || example.trim().length == 0) {
                    example = '<span style="color: blue;"><i>(example not available)</i></span>';
                }

                synonyms = '';
                $.each(value.synonyms, function (index, value) {
                    synonyms += `${value}, `;
                });

                if (synonyms != null || synonyms != 'undefined' || synonyms.trim().length > 1) {
                    synonyms = synonyms.slice(0, -2);
                }

                if (synonyms == null || synonyms == 'undefined' || synonyms.trim().length == 0) {
                    synonyms = '<span style="color: blue;"><i>(synonyms not available)</i></span>';
                }

                htmlTag += `
                            <div style = "flex: 1; display: flex; flex-direction: row; margin: 0 10px 0 10px; word-break: break-all;" >
                                <label style="flex: 0 0 150px; margin-bottom: 0;"><!-- filler --></label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px 5px 0 5px; font-weight: normal; border-top: 1px solid black; border-left: 1px solid black;">${definition}</label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px 5px 0 5px; font-weight: normal; border-top: 1px solid black; border-left: 1px solid black;">${example}</label>
                                <label style="flex: 1; margin-bottom: 0; padding: 5px 5px 0 5px; font-weight: normal; border-top: 1px solid black; border-left: 1px solid black; border-right: 1px solid black;">${synonyms}</label>
                           </div>`;


            });
            htmlTag += `
                            <div style = "flex: 1; display: flex; flex-direction: row; margin: 0 10px 10px 10px;" >
                                <label style="flex: 0 0 150px;"><!-- filler --></label>
                                <label style="flex: 1; font-weight: normal; border-bottom: 1px solid black;"></label>
                                <label style="flex: 1; font-weight: normal; border-bottom: 1px solid black;"></label>
                                <label style="flex: 1; font-weight: normal; border-bottom: 1px solid black;"></label>
                           </div>`;

            htmlTag += `</div>`;
        });

        htmlTag += `</div>`;

        tagOutput.append(htmlTag);
    });


   

}

function IsDataListDuplicated(input) {
    var dupflag = false;
    var options = $('#dsSavedWords').children();
    $.each(options, function (index, option) {
        if (option.value == input) {
            dupflag = true;
            return false;
        }
    });
    return dupflag;
}
