/**
 * Created by xavier on 2/21/14.
 */

Template.surveyRecipients.helpers({
    recipients: function(){
        return Recipients.find();
    },
    view: function(){
        return Session.get('view')+'#'+Session.get('surveyId');
    }
});

Template.surveyRecipients.events({ 'click .toggle': function(e){
    e.preventDefault();
    $(e.target).toggleClass('folded')
    $('#recipients').toggleClass('hidden');
}
});