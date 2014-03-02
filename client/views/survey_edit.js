Template.surveyEdit.helpers({
  'surveyName': function () {
    //todox better understand and handle missing survey
    return this.survey ? surveyName(this.survey.name) : "MISSING";
  }
});

Template.surveyEdit.events({
  'click #surv-save-btn': function (e) {
    e.preventDefault();
    var survSet = {
      name: $('#surv-name-input').val(),
      mail_subject: $('#mail-subject-input').val(),
      mail_from: $('#mail-from-input').val(),
      mail_body: $('#mail-body-input').val(),
      survey_title: $('#surv-title-input').val(),
      survey_body: $('#surv-body-input').val()
    };
    var surveyId = $('#surv-id').val();
    console.log("updating survey " + surveyId + " with " + JSON.stringify(survSet));
    // todox move to Meteor method call
    // todox check survey exists, user logged, and owner
    // todox fix tab loss issue
// loses the active tab if and only if actual update occurs > probably linked to reactivity somehow
// code below was a tentative to re-set active tab after update but did not work
//        var href = $('#survey-tabs').find('.active a').attr('href');
//        console.log("current tab="+href);
    Surveys.update({_id: surveyId}, {$set: survSet});
//        $('#survey-tabs').find('a[href="' + href + '"]').tab('show');

  }
});

Template.surveyMain.helpers({
  'urlFill': function () {
    return Router.routes['surveyFill'].url({_id: this._id});
  }
});

Template.surveyParticipants.helpers({
  recipients: function () {
    return this.recipients;
  },
  'urlSurvey': function (id) {
    var surveyId = id;
    var params = {
      _id: surveyId,
      mail: this.mail
    };
    //console.log("building urlFill for "+JSON.stringify(params));
    return Router.routes['surveyFill'].url(params);
  }
});

Template.surveyParticipants.events({
  'click .delete': function (e) {
    e.preventDefault();
    //todox check user authorized!
    //todox check recipient and survey are consistent
    var recToDel = {mail: e.target.getAttribute('data-mail')};
    var surveyId = $('#surv-id').val();
    console.log("deleting recipient " + JSON.stringify(recToDel) + " in survey" + surveyId);
    if (confirm("Delete this recipient (" + recToDel.mail + ")?")) {
      //todox move to Meteor method call
      Surveys.update({_id: surveyId}, {$pull: {"recipients": recToDel}})
    }
  }
});