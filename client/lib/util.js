callMeteor = function (methodName, surveyId, data, newRoute) {
  Meteor.call(methodName, surveyId, data, function (error, result) {
    if (error) {
      return alert(error.reason);
    }
//    console.log("called "+methodName + " result=" + result);
    if (newRoute) {
      Router.go(newRoute, {_id: result});
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
      result[$(this).attr('name')] = $(this).val();
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