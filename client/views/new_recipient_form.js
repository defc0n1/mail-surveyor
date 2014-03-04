Template.newRecipientForm.events({
  'click .btn': function (e) {
    e.preventDefault();
    var newRecipient = formToData(recipientEditableProperties);
    newRecipient.survey_id = this._id;
    callMeteor('recipientCreate', null, newRecipient);
  }
});