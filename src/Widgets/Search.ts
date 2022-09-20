import { QuestionTextModel, Serializer } from 'survey-core';

type CustomQuestionTextModel = QuestionTextModel & {
    hasSearch: boolean,
}

export const Search = {
    //the widget name. It should be unique and written in lowercase.
    name: "search",
    //SurveyJS library calls this function for every question to check 
    //if this widget should apply to the particular question.
    isFit: function (question: any) {
        //We are going to apply this widget for comment questions (textarea)
        return question.getType() === "comment";
    },
    //We will change the default rendering, but do not override it completely
    isDefaultRender: true,
    //"question" parameter is the question we are working with and "el" parameter is HTML textarea in our case
    init() {
        //Add a boolean property hasSearch into comment question.
        //Use switch property editor for it.
        //you can have a simple check property editor by changing ":switch" to ":boolean"
        //Add it to general category
        Serializer.addProperty("comment", {
            name: "hasSearch:switch",
            // default: false, 
            category: "general",
        });
    },
    afterRender: function (question: CustomQuestionTextModel, el: HTMLInputElement) {
        el = <HTMLInputElement>el.children[0];
        //Create a div with an input text and a button inside
        var mainDiv = document.createElement("div");
        var searchEl = document.createElement("input");
        searchEl.style.width = "calc(100% - 120px)";
        var btnEl = document.createElement("button");
        btnEl.innerText = "Search";
        btnEl.style.width = "120px";
        var searchIndex = 0;
        //Start searching from the beginning on changing the search text
        searchEl.onchange = function () {
            searchIndex = 0;
        };
        //Do the search on button click
        btnEl.onclick = function () {
            var searchText = searchEl.value;
            var text = el.value;
            console.log(searchText);
            console.log(text);
            //Do nothing if search text or textarea is empty
            if (!searchText || !text) return;
            var index = text.indexOf(searchText, searchIndex + 1);
            //If nothing found, but started not from the beginning then start from the beginning
            if (index < 0 && searchIndex > -1) {
                index = text.indexOf(searchText, 0);
            }
            searchIndex = index;
            //If found the text then focus the textarea and select the search text.
            if (index > -1) {
                el.focus();
                el.setSelectionRange(index, index + searchText.length);
            }
        };
        mainDiv.appendChild(searchEl);
        mainDiv.appendChild(btnEl);
        //Append the div with search input and button before textarea
        //@ts-ignore
        el.parentElement.insertBefore(mainDiv, el);

        //Hide the search panel/div if hasSearch is not true
        mainDiv.style.display = !question.hasSearch ? "none" : "";
        //On every hasSearch property changing call the anonym function
        question.registerFunctionOnPropertyValueChanged("hasSearch",
            function () {
                mainDiv.style.display = !question.hasSearch ? "none" : "";
            });
    },
};