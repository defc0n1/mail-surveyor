Template.surveysList.events({
    'click #btn-new-survey': function (e) {
        e.preventDefault();
        // todo check logged in
        var survey = {
            owner_id: Meteor.userId(),
            created_at: new Date(),
            name: undefined,
            mail_from: Meteor.user().emails[0].address,
            mail_subject: undefined,
            mail_body: undefined,
            survey_title: undefined,
            survey_body: undefined,
            status: 'new',
            recipients: []
        };
        survey._id = Surveys.insert(survey);
        console.log("added survey "+survey._id);
        Router.go('surveyEdit', {_id: survey._id});
    },
    'click .delete': function (e) {
        e.preventDefault();
        // todo check user logged in, survey exists, and is owner
        var surveyId = e.target.getAttribute('data-survey');
        var surv = Surveys.findOne(surveyId);
        console.log("deleting survey " + surveyId);
        if (confirm("Delete this survey ("+surv.name+")?")) {
            Surveys.remove(surveyId);
        }
    }
});

Template.surveyItem.helpers({
    'count': function(){
        return this.recipients ? this.recipients.length : 0;
    },
    'name': function(){
        return surveyName(this.name);
    },
    'created_at': function(){
        return dateFormat(this.created_at, 'mmm d, yyyy');
    }
});