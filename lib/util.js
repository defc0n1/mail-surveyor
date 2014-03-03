surveyName = function (name) {
  return name ? name : new Handlebars.SafeString('<i>untitled</i>');
};

s = function(obj) {
  JSON.stringify(obj);
}

cs = function(obj) {
  console.log(JSON.stringify(obj));
}

decode = function (input) {
  return input ? decodeURI(input) : input;
};

/*
returns a new hash, with only the specified fields.
Values must be String only.
 */
copyOnly= function(hash, fieldsArray) {
  var result = {};
  for(var i in fieldsArray) {
    var field = fieldsArray[i];
    if(hash.hasOwnProperty(field)) {
      var value = hash[field];
      check(value, String);
      result[field] = hash[field];
    }
  }
  return result;
}

/*
 returns the recipient object with a given mail
 both args are mandatory
 undefined if survey has no such recipient
 */
getRecipient = function (survey, mail) {
//  console.log("getRecipient "+mail+" on "+survey._id);
  if (!(survey && mail)) {
    return undefined;
  }
  var matches = survey.recipients.filter(function (item) {
    return item.recipient_mail === mail;
  });
  return matches.length > 0 ? matches[0] : undefined;
};