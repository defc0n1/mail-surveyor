Template.surveyFill.helpers({
  'canEdit': function () {
    return isSurveyOwner(Meteor.userId(), this.survey);
  },
  'recipient': function () {
    return getRecipient(this.survey, this.recipient_mail);
  },
  'helpSurvey': function(){
    return this.survey;
  }
});

Template.surveyFill.events({
  'click #survey-save-btn': function(e){
    e.preventDefault();
    var surveyId = $('#survey-id').val();
    var recMail = $('#recipient-mail-input').val();
    var data = {
      recipientMail: recMail,
      result: formToData()
    };
    callMeteor('resultCreate', surveyId, data);
    // todox re-route to a Thank you page
  }
});