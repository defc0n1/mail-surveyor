surveyName = function (name) {
  return name ? name : new Handlebars.SafeString('<i>untitled</i>');
};

/*
 returns proper url for named route and specified survey and recipient IDs.
 */
urlRouteSurveyRecipient = function (routeName, surveyId, recipientId) {
//  ca('urlRouteSurveyRecipient', arguments);
  var params = {};
  if (surveyId) {
    params.survey_id = surveyId
  }
  if (recipientId) {
    params.recipient_id = recipientId;
  }
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
 -listProperties: mandatory.
 */
propertiesToData = function (listProperties) {
  var result = {};
  for (var i in listProperties) {
    var pty = listProperties[i];
    result[pty] = $('#' + toHtmlId(pty)).val();
  }
  return result;
};

/*
 Will take data back and forth an HTML form.
 Fields MUST have a name property (and be of a sensible tag/type).
 - properties: if supplied, restrict transfer to these properties, otherwise transfers all form fields.
 - data: if supplied, will transfer to/from it. Otherwise uses a fresh new object.
 - toForm: if true, transfers from data to form, otherwise from form to data.
 Returns data object.
 */
formToData = function (data, toForm) {
//  ca('formToData', arguments);
  var result = data ? data : {};
  var fields = $('form').find("input, textarea, select");
  fields.each(function (index) {
    var type = $(this).attr('type');
    var name = $(this).attr('name');
//    cs(name,type);
    // only affect fields with name attribute
    if(!name){
//      console.log('ignore (name)');
      return;
    }
    // these fields don't hold values that map to data
    if ($.inArray(type,['button', 'file', 'image', 'reset', 'search', 'submit'])>=0) {
//      console.log('ignore (type)');
      return;
    }
    // these fields map using the 'checked' option
    if ($.inArray(type,['radio', 'checkbox'])>=0) {
//      console.log('checked');
      if (toForm) {
        if (result[name]) {
//          cs('restoring', name);
          if($(this).val()===result[name]) {$(this).prop('checked', true);};
        }
      } else {
        if (this.checked) {
          result[name] = $(this).val();
        }
      }
      return;
    }
    // all the other fields map simply with val()
//    console.log('val()');
    if (toForm) {
//        cs('restoring', name);
      $(this).val(result[name]);
    } else {
      result[name] = $(this).val();
    }
    return;
  });
  return result;
};

var transferProperty = function (property, data, formElement, toForm) {
};

/*
 converts a property to corresponding html id
 */
toHtmlId = function (property) {
  //todox error if null or non String
  return property.replace(/_/g, '-') + "-input";
};