Template.surveysList.events({
  'click #btn-new-survey': function (e) {
    e.preventDefault();
    callMeteor('surveyCreate', null, null, 'surveyEdit');
  },
  'click .delete': function (e) {
    e.preventDefault();
    var surveyId = e.target.getAttribute('data-survey');
    var survey = Surveys.findOne({_id: surveyId});
    var name = survey.survey_name ? survey.survey_name : 'untitled';
    if (confirm("Delete this survey (" + survey.survey_name + ")?")) {
      callMeteor('surveyDelete', surveyId);
    }
  },
  'click #btn-login-show': function(e) {
    e.preventDefault();
    e.stopPropagation();
    // pretty hacky, but gets the job done, and cleaner solutions (.click, .dropdown) fail miserably.
    Accounts._loginButtonsSession.set('inSignupFlow', true);
    var elt=$('#login-dropdown-list');
    elt.toggleClass('open');
  }
});

Template.surveysList.helpers({
  'loggedIn': function(){
    return Meteor.userId();
  }
});

Template.surveyItem.helpers({
  'name': function () {
    return surveyName(this.survey_name);
  },
  'created_at': function () {
    return dateFormat(this.created_at, 'mmm d, yyyy');
  },
  'urlEdit': function(surveyId) {return urlRouteSurveyRecipient('surveyEdit', surveyId);}
});