Template.surveyEdit.events({
    'click #surv-save-btn': function(e){
        e.preventDefault();
        var survSet = {
            name: $('#surv-name-input').val(),
            mail_subject: $('#mail-subject-input').val(),
            mail_from: $('#mail-from-input').val(),
            mail_body: $('#mail-body-input').val(),
            survey_title: $('#surv-title-input').val(),
            survey_body: $('#surv-body-input').val()
        };
        var surveyId = $('#surv-id').val();
        console.log("updating survey "+surveyId+" with "+JSON.stringify(survSet));
        // todo check survey exists, user logged, and owner
// loses the active tab if and only if actual update occurs > probably linked to reactivity somehow
// code below was a tentative to re-set active tab after update but did not work
//        var href = $('#survey-tabs').find('.active a').attr('href');
//        console.log("current tab="+href);
        Surveys.update({_id: surveyId}, {$set: survSet});
//        $('#survey-tabs').find('a[href="' + href + '"]').tab('show');

    }
});

Template.surveyMain.helpers({
    'urlFill': function () {
        return Router.routes['surveyFill'].url({_id: this._id})
    }
});

Template.surveyParticipants.helpers({
    recipients: function () {
        return this.recipients;
    }
});

Template.surveyParticipants.events({
    'click .delete': function (e) {
        e.preventDefault();
        //todo refactor to use data-mail and look in current recipients
        //todo check user authorized!
        //todo check recipient and survey are consistent
        var recToDel = {mail: e.target.getAttribute('data-mail')};
        var surveyId = $('#surv-id').val();
        console.log("deleting recipient " + JSON.stringify(recToDel) + " in survey" + surveyId);
        if (confirm("Delete this recipient (" + recToDel.mail + ")?")) {
            Surveys.update({_id: surveyId}, {$pull: {"recipients": recToDel}})
        }
    }
});