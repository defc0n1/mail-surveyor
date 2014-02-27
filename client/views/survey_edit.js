Template.surveyInfo.events({
    'click .toggle': function (e) {
        e.preventDefault();
        $(e.target).toggleClass('folded')
        $('#survey').toggleClass('hidden');
    }
});

Template.surveyRecipients.helpers({
    recipients: function(){
        return Recipients.find();
    }
});

Template.surveyRecipients.events({ 'click .toggle': function(e){
    e.preventDefault();
    $(e.target).toggleClass('folded')
    $('#recipients').toggleClass('hidden');
}
});

Template.surveyActions.events({ 'click .toggle': function (e) {
    e.preventDefault();
    $(e.target).toggleClass('folded')
    $('#sendMail').toggleClass('hidden');
},
    'click .btn': function (e) {
        e.preventDefault();
        alert("Clicked on " + e.target);
    }
});