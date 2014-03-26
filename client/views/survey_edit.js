Template.surveyEdit.helpers({
  'surveyName': function () {
    return this.survey ? surveyName(this.survey.survey_name) : "MISSING";
  }
});

Template.surveyEdit.events({
  'click #survey-save-btn': function (e) {
    e.preventDefault();
    var data = propertiesToData(surveyEditableProperties);
    var surveyId = $('#survey-id-input').val();
    callMeteor('surveyUpdate', surveyId, data);
  }
});

Template.surveyEdit.rendered = function () {
  // to solve tab loss issue
  var hash = window.location.hash || '#survey-main'
  var elt = $('#survey-tabs a[href="' + hash + '"]');
  elt.tab('show');
};

Template.surveyMain.helpers({
  'urlFill': function (surveyId, recipientId) {
    return urlRouteSurveyRecipient('surveyFill', surveyId, recipientId);
  }
});

Template.surveyParticipants.helpers({
  'recipients': function () {
    return Recipients.find({survey_id: this._id}, {sort: {created_at: -1}});
  },
  'recipient_state': function () {
    return this.state ? this.state.stateId : "";
  },
  'urlResults': function (surveyId, recipientId) {
    return urlRouteSurveyRecipient('surveyResults', surveyId, recipientId);
  },
  'urlFill': function (surveyId, recipientId) {
    return urlRouteSurveyRecipient('surveyFill', surveyId, recipientId);
  }
});

Template.surveyParticipants.events({
  'click .mail': function (e) {
    e.preventDefault();
    var idToMail = e.target.getAttribute('data-id');
    var recipientToMail = Recipients.findOne(idToMail);
    if (confirm("Send mail to " + recipientToMail.recipient_name + "?")) {
      callMeteor('invitationSend', recipientToMail.survey_id, recipientToMail._id);
    }
  },
  'click .delete': function (e) {
    e.preventDefault();
    var idToDel = e.target.getAttribute('data-id');
    var recipientToDelete = Recipients.findOne(idToDel);
    if (confirm("Delete this recipient (" + recipientToDelete.recipient_name + ")?")) {
      callMeteor('recipientDelete', recipientToDelete._id);
    }
  },
  'click .recipient-set': function(e) {
    e.preventDefault();
    var recipientId = e.target.getAttribute('data-id');
    var recipient = Recipients.findOne(recipientId);
    cs('rec', recipient);
    $("#recipient-name-input").val(recipient.recipient_name);
    $("#recipient-mail-input").val(recipient.recipient_mail);
  }
});