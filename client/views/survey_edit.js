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
  'urlResults': function (surveyId, recipientId) {
    return urlRouteSurveyRecipient('surveyResults', surveyId, recipientId);
  },
  'urlFill': function (surveyId, recipientId) {
    return urlRouteSurveyRecipient('surveyFill', surveyId, recipientId);
  }
});

Template.surveyParticipants.events({
  'click .delete': function (e) {
    e.preventDefault();
    var idToDel = e.target.getAttribute('data-id');
    var recipientToDelete = Recipients.findOne(idToDel);
    if (confirm("Delete this recipient (" + recipientToDelete.recipient_name + ")?")) {
      callMeteor('recipientDelete', recipientToDelete._id);
    }
  }
});