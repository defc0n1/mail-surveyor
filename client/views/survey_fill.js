Template.surveyFill.helpers({
  'canEdit': function () {
    return isOwner(Meteor.userId(), this.survey);
  }
});

Template.surveyFill.rendered = function () {
//  cs('rendered.this',""+this.keys);
  var recipientId = $('#recipient-id-input').val();
//  cs('recipientId',recipientId);
  if(!recipientId) {return;}
  var recipient = Recipients.findOne(recipientId);
//  cs('recipient', recipient);
  var data = recipient.recipient_result;
  if(!data){return;}
//  cs('recipient_result', data);
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
        cs('result', result);
        if (error) {
          $('#message-flash').append(Template._alert({msg: "<div><strong>Oops!</strong> There was this error: " + error.reason + "</div>", type: 'danger'}));
        } else {
          $('#message-flash').append(Template._alert({msg: "<strong>Thank you!</strong> Your participation means a lot to us.", type: 'success'}));
        }
      });
    } else {
      alert("Apologies, but I really need an email address to store your results.");
    }
  }
});