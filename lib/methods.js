/*
 All method call signature standardized to (id, data) for ease of calling them.
 Meaning: apply data to entity identified by id.
 Parameters silently ignored when makes no sense (caller should just pass null in those cases).
 Should always return a meaningful id.
 */
Meteor.methods({
  /*
   both parameters ignored
   */
  'surveyCreate': function (id, data) {
    ensureOwnership(Surveys, null);
    var survey = newTimestampObject();
    setProperties(surveyEditableProperties, survey, "");
    survey.mail_from = Meteor.user().emails[0].address;
    survey.recipients_count = 0;
    var newId = Surveys.insert(survey);
    return newId;
  },

  'surveyUpdate': function (id, data) {
    ensureOwnership(Surveys, id);
    var dataOk = setProperties(surveyEditableProperties, null, data);
    Surveys.update({_id: id}, {$set: dataOk});
    return id;
  },

  /*
   2nd parameter is ignored
   */
  'surveyDelete': function (id, data) {
    ensureOwnership(Surveys, id);
    Recipients.remove({survey_id: id});
    Surveys.remove(id);
    return id;
  },

  /*
   1st parameter ignored
   */
  'recipientCreate': function (id, data) {
    if (!data.survey_id) {
      throw new Meteor.Error(422, "Missing survey id")
    }
    var survey = ensureOwnership(Surveys, data.survey_id);

    var dataOk = newTimestampObject();
    dataOk.survey_id = survey._id;
    setProperties(recipientEditableProperties, dataOk, data);
    if (!dataOk.recipient_mail || !dataOk.recipient_name) {
      throw new Meteor.Error(422, "Missing recipient field")
    }

    //check for duplicates (same mail address
    var existingRecipient = Recipients.findOne({
      owner_id: dataOk.owner_id,
      survey_id: dataOk.survey_id,
      recipient_mail: dataOk.recipient_mail
    });
    var idToReturn;
    if (existingRecipient) {
      Recipients.update(
          {_id: existingRecipient._id},
          {$set: {recipient_name: dataOk.recipient_name}}
      );
      idToReturn = existingRecipient._id;
    } else {
      idToReturn = rawCreateRecipient(dataOk);
    }
    return idToReturn;
  },

  /*
   2nd parameter is ignored
   */
  'recipientDelete': function (id, data) {
    var recipientToDelete = ensureOwnership(Recipients, id);
    // let's be extra paranoid - the below should have been blocked on insert
    var survey = ensureOwnership(Surveys, recipientToDelete.survey_id);
    Recipients.remove(recipientToDelete._id);
    Surveys.update(
        {_id: recipientToDelete.survey_id},
        {$inc: {recipients_count: -1}});
    return id;
  },

  /*
   PUBLIC Method (accessible to non-logged user)
   1st param is recipientId or null if anonymous data
   2nd param contains keys
   - form_data
   - recipient
   - survey
   */
  'resultCreate': function (id, data) {
    //todox survey setup parameter: allow new recipients or not.
    // input sanitizing
    if (id) {
      check(id, String);
    }
    var recipientId = id; // convention > don't use arg variables except in sanitizing.

    var surveyId = data.survey._id;
    check(surveyId, String);

    var recipientMail = data.recipient.recipient_mail;
    if (recipientMail) {
      check(recipientMail, String);
    }

    var dataOk = setProperties(null, null, data.form_data);

    // input validation
    if (!surveyId) {
      throw new Meteor.Error(422, "Missing survey id");
    }
    if (!recipientId && !recipientMail) {
      throw new Meteor.Error(422, "Missing recipient info");
    }

    // data validation
    var survey = Surveys.findOne(surveyId);
    if (!survey) {
      throw new Meteor.Error(404, "Unable to locate survey");
    }
    var recipient;
    if (recipientId) {
      recipient = Recipients.findOne(recipientId);
      if (!recipient) {
        throw new Meteor.Error(404, "Unable to locate recipient");
      }
      if (recipient.survey_id !== surveyId) {
        throw new Meteor.Error(422, "Inconsistent survey/recipient");
      }
    } else {
      // is the mail already listed as a recipient?
      recipient = Recipients.findOne({survey_id: surveyId, recipient_mail: recipientMail});
      if (!recipient) {
        // we really need to create one...
        recipient = newTimestampObject();
        recipient.owner_id = survey.owner_id;
        recipient.survey_id= surveyId;
        recipient.recipient_name= 'anonymous';
        recipient.recipient_mail= recipientMail;
        recipient._id = rawCreateRecipient(recipient);
      }
    }
    // from here recipient is guaranteed to exist in collection and be legit, so let's just set its results!
    Recipients.update(
        {_id: recipient._id},
        {$set: {recipient_result: dataOk}});
    return recipient._id;
  }
});

/*
 Inserts the supplied recipient without any check - use with caution!
 returns the new recipient_id
 */
var rawCreateRecipient = function (recipientData) {
  var resultId = Recipients.insert(recipientData);
  Surveys.update(
      {_id: recipientData.survey_id},
      {$inc: {recipients_count: 1}});
  return resultId;
}