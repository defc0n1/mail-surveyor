/**
 * Created by xavier on 2/21/14.
 */
Template.newRecipientForm.events({
    'click .btn': function(e) {
        e.preventDefault();
        var recipient = {
            name: $('#newRecipientForm').find('[name="name"]').val(),
            mail: $('#newRecipientForm').find('[name="mail"]').val()
        }
        recipient._id = Recipients.insert(recipient);
    }
});