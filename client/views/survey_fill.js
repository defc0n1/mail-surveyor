Template.surveyFill.helpers({
  'canEdit': function () {
    return isOwner(Meteor.userId(), this.survey);
  }
});

Template.surveyFill.events({
  'click #survey-save-btn': function(e){
    e.preventDefault();
    var surveyId = $('#survey-id-input').val();
    var recipientId = $('#recipient-id-input').val();
    var recipientMail = $('#recipient-mail-input').val();

    if(recipientId || recipientMail) {
      var data = {
        form_data: formToData(),
        recipient: {recipient_mail: recipientMail},
        survey: {_id: surveyId}
      };

      Meteor.call('resultCreate', recipientId, data, function (error, result) {
        cs('result', result);
        if (error) {
          return alert(error.reason);
       }
        // todox re-route to a Thank you page
        Router.go('surveyResults', {survey_id: surveyId, recipient_id: result});
      });
    } else {
      alert("Apologies, but I really need an email address to store your results.");
    }
  }
});