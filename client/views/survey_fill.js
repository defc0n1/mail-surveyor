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
          $('#message-flash').append(Template._alert({msg: "<div><strong>Oops!</strong> There was this error:</div><div>"+error.reason+"</div>", type:'danger'}));
       }
        $('#message-flash').append(Template._alert({msg: "<strong>Thank you!</strong> Your participation means a lot to us.", type:'success'}));
      });
    } else {
      alert("Apologies, but I really need an email address to store your results.");
    }
  }
});