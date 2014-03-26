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
    var survey = new TimestampObject();
    setProperties(surveyEditableProperties, survey, "");
    survey.mail_from = Meteor.user().emails[0].address;
    survey.survey_title = 'Superb Survey Subject'
    survey.survey_body = '<div class="form-group">\n<label for="textinput">How do you feel now?</label>\n<input id="textinput" name="textinput" type="text" placeholder="answer" class="form-control"/>\n</div>';
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
    var dataOk = new TimestampObject();
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
          {$set: {
            recipient_name: dataOk.recipient_name
          }}
      );
      idToReturn = existingRecipient._id;
    } else {
      State.setState('new', Recipients, dataOk);
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
   Sends mails for a given survey.
   1st param is surveyId
   2nd param is recipientId or undef to mail all list.
   */
  'invitationSend': function (id, data) {
    var survey = ensureOwnership(Surveys, id);
    if(data) {
      var recipient = ensureOwnership(Recipients, data);
      if (recipient.survey_id !== survey._id) {
        throw new Meteor.Error(422, "Inconsistent survey/recipient");
      }
      State.setState('sending', Recipients, recipient);
      Recipients.update(
          {_id: recipient._id},
          {$set: {state: recipient.state}}
      );
      var addr = recipient.recipient_name + ' <' + recipient.recipient_mail + '>';
      if(Meteor.isServer){
        Email.send({
          from: survey.mail_from,
          to: addr,
          subject: survey.mail_subject,
          text: survey.mail_body
        });
        //todo catch errors and switch to "issue" state.
//        var Future = Npm.require('fibers/future');
//        var future = new Future();
//        Meteor.setTimeout(function() {
//          future.return();
//        }, 3 * 1000);
//        future.wait();
        State.setState('sent', Recipients, recipient);
        Recipients.update(
            {_id: recipient._id},
            {$set: {state: recipient.state}}
        );
      }
    }
    // log survey status
    // unblock here
    var recipients = Recipients.find({survey_id: survey.id});
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
        recipient = new TimestampObject();
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