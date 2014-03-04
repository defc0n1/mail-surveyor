Template.surveyEdit.helpers({
  'surveyName': function () {
    //todox better understand and handle missing survey, waitOn
    return this.survey ? surveyName(this.survey.survey_name) : "MISSING";
  }
});

Template.surveyEdit.events({
  'click #survey-save-btn': function (e) {
    e.preventDefault();
    var data = formToData(surveyEditableProperties);
    var surveyId = $('#survey-id-input').val();
    callMeteor('surveyUpdate', surveyId, data);
// todox fix tab loss issue
// loses the active tab if and only if actual update occurs > probably linked to reactivity somehow
// code below was a tentative to re-set active tab after update but did not work
//        var href = $('#survey-tabs').find('.active a').attr('href');
//        cs("current tab",href);
//        $('#survey-tabs').find('a[href="' + href + '"]').tab('show');
  }
});

Template.surveyMain.helpers({
  'urlFill': function (surveyId, recipientId) {
//    cs('main.urlFill surveyId',surveyId);
//    cs('main.urlFill recipientId',recipientId);
    return urlRouteSurveyRecipient('surveyFill', surveyId, recipientId);
//    return 'bwaaah?';
  }
});

Template.surveyParticipants.helpers({
  'recipients': function () {
    return Recipients.find({survey_id: this._id});
  },
  'urlResults': function (surveyId, recipientId) {return urlRouteSurveyRecipient('surveyResults', surveyId, recipientId);},
  'urlFill': function (surveyId, recipientId) {return urlRouteSurveyRecipient('surveyFill', surveyId, recipientId);}
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