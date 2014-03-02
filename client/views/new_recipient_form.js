Template.newRecipientForm.events({
  'click .btn': function (e) {
    e.preventDefault();
    var newRecipient = {
      name: $('#rec-name-input').val(),
      mail: $('#rec-mail-input').val()
    }
    console.log("adding " + JSON.stringify(newRecipient) + " to " + this._id);
    //todox check for duplicates on mail before inserting
    //todox move to Meteor method call
    Surveys.update({_id: this._id}, {$push: {"recipients": newRecipient}})
  }
});