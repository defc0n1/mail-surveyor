Template.surveyFill.helpers({
  'canEdit': function () {
    return Meteor.userId;
  },
  'recipient': function () {
    var recMail = this.mail;
    if(!this.survey) {return undefined;};
    var matches = this.survey.recipients.filter(function(item){
      return item.mail === recMail;
    });
    return matches.length > 0 ? matches[0] : undefined;
  }
});

Template.surveyFill.events({
  'click #surv-save-btn': function(e){
    e.preventDefault();

    var surveyId = $('#surv-id').val();
    var recMail = $('#rec-mail-input').val();
    //todox check both are present and survey exists

    var result = {};
    // passer sur tous les input+textarea+select du form, noter name=val dans result
    var fields = $('#surv-main-form').find("input, textarea, select");
    fields.each(function(index) {
      //todox validate field value
      result[$(this).attr('name')] = $(this).val();
    });

    console.log("updating survey "+surveyId+" recipient "+recMail+" with "+JSON.stringify(result));

    var data = {
      surveyId: surveyId,
      recipientMail: recMail,
      result: result
    };

    Meteor.call('saveSurveyResult', data, function(error, id) {
      if (error) {return alert(error.reason);}
      // todox re-route to a Thank you page
      //Router.go('postPage', {_id: id});
    });
  }
});