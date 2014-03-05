Template.newRecipientForm.events({
  'click .btn': function (e) {
    e.preventDefault();
    var newRecipient = propertiesToData(recipientEditableProperties);
    newRecipient.survey_id = this._id;
    callMeteor('recipientCreate', null, newRecipient);
  }
});