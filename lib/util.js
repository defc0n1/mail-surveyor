surveyName = function (name){
    return name ? name : new Handlebars.SafeString('<i>untitled</i>');
};