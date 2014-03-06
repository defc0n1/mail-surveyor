Template.surveyFill.helpers({
  'canEdit': function () {
    return isOwner(Meteor.userId(), this.survey);
  }
});

Template.surveyFill.rendered = function () {
  var recipientId = $('#recipient-id-input').val();
  if(!recipientId) {return;}
  var recipient = Recipients.findOne(recipientId);
  var data = recipient.recipient_result;
  if(!data){return;}
  formToData(data, true);
};

Template.surveyFill.events({
  'submit form': function (e) {
    e.preventDefault();
    var surveyId = $('#survey-id-input').val();
    var recipientId = $('#recipient-id-input').val();
    var recipientMail = $('#recipient-mail-input').val();
    var formData = formToData(null, false);
    if (recipientId || recipientMail) {
      var data = {
        form_data: formData,
        recipient: {recipient_mail: recipientMail},
        survey: {_id: surveyId}
      };
      Meteor.call('resultCreate', recipientId, data, function (error, result) {
        if (error) {
          $('#message-flash').html(Template._alert({msg: "<div><strong>Oops!</strong> There was this error: " + error.reason + "</div>", type: 'danger'}));
        } else {
          $('#message-flash').html(Template._alert({msg: "<strong>Thank you!</strong> Your participation means a lot to us.", type: 'success'}));
        }
      });
    } else {
      $('#message-flash').html(Template._alert({msg: "<div>Apologies, but I <strong>really</strong> need an email address to store your results.</div>", type: 'danger'}));
//      alert("Apologies, but I really need an email address to store your results.");
    }
  }
});