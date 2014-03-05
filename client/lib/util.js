surveyName = function (name) {
  return name ? name : new Handlebars.SafeString('<i>untitled</i>');
};

/*
returns proper url for named route and specified survey and recipient IDs.
 */
urlRouteSurveyRecipient= function(routeName, surveyId, recipientId){
//  ca('urlRouteSurveyRecipient', arguments);
  var params = {};
  if(surveyId){params.survey_id= surveyId}
  if(recipientId){params.recipient_id= recipientId;}
  return Router.routes[routeName].url(params);
};

/*
Convenience wrapper around calling method 'name' with params 'id' and 'data',
performing minimal error handling, and (optionally) redirecting to 'newRoute'+call result.
 */
callMeteor = function (methodName, id, data, newRoute) {
  Meteor.call(methodName, id, data, function (error, result) {
    if (error) {
      return alert(error.reason);
    }
//    cs("called "+methodName + " result", result);
    if (newRoute) {
      Router.go(newRoute, {survey_id: result});
    }
  });
};

/*
 Will take data from an HTML form and stuff it in a hash object.
 If list of properties is passed, will take from them.
 Otherwise will grab all data from all the forms in the page.
 */
formToData = function (listProperties) {
  var result = {};
  if (listProperties) {
    for(var i in listProperties){
      var pty = listProperties[i];
      result[pty] = $('#'+toHtmlId(pty)).val();
    }
  } else {
    var fields = $('form').find("input, textarea, select");
    fields.each(function(index) {
      // lil' hack for radio buttons
      if(($(this).attr('type')!='radio' && $(this).attr('type')!='checkbox') || this.checked)  {
        result[$(this).attr('name')] = $(this).val();
      }
    });
  }
  return result;
};

/*
 converts a property to corresponding html id
 */
toHtmlId = function (property) {
  //todox error if null or non String
  return property.replace(/_/g, '-') + "-input";
};