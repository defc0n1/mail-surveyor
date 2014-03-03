Template.newRecipientForm.events({
  'click .btn': function (e) {
    e.preventDefault();
    var newRecipient = formToData(recipientEditableProperties);
    callMeteor('recipientCreate', this._id, newRecipient);
  }
});