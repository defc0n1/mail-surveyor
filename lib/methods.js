Meteor.methods({
  'surveyCreate': function () {
    ensureOwnership(null);
    var survey = {
      owner_id: Meteor.userId(),
      created_at: new Date(),
      survey_name: "",
      mail_from: Meteor.user().emails[0].address,
      mail_subject: "",
      mail_body: "",
      survey_title: "",
      survey_body: "",
      status: 'new',
      recipients: []
    };
    var id = Surveys.insert(survey);
    return id;
  },

  'surveyUpdate': function (surveyId, data) {
    ensureOwnership(surveyId);
    var dataOk = copyOnly(data, surveyEditableProperties);

    Surveys.update({_id: surveyId}, {$set: dataOk});
  },

  'surveyDelete': function (surveyId) {
    ensureOwnership(surveyId);
    Surveys.remove(surveyId);
  },

  'recipientCreate': function (surveyId, data) {
    var survey = ensureOwnership(surveyId);
    var dataOk = copyOnly(data, recipientEditableProperties);
    //check for duplicates
    var r = getRecipient(survey, dataOk.recipient_mail);
    if(r){
      Surveys.update(
          {_id: surveyId, "recipients.recipient_mail": dataOk.recipient_mail},
          {$set: {"recipients.$.recipient_name": dataOk.recipient_name}});
    } else {
      Surveys.update({_id: surveyId}, {$push: {"recipients": dataOk}})
    }
  },

  'recipientDelete': function (surveyId, recipientMail) {
    check(recipientMail, String);
    var survey = ensureOwnership(surveyId);
    var r = getRecipient(survey, recipientMail);
    if(!r) {
      // user is logged in, owns survey, but is trying to remove a participant that is not here.
      throw new Meteor.Error(404, "No participant to this survey with this mail");
    }
    console.log("deleting recipient " + JSON.stringify(r) + " in survey" + surveyId);
    Surveys.update({_id: surveyId}, {$pull: {"recipients": r}})
  },

  'resultCreate': function (surveyId, data) {
    //todox check survey and mail - esp if new mail, create recipient w/ dummy name
    //todox survey setup parameter: allow new recipients or not.
    Surveys.update(
        {_id: surveyId, "recipients.recipient_mail": data.recipientMail},
        {$set: {"recipients.$.recipient_result": data.result}});
  }

});
