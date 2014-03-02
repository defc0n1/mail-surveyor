Meteor.publish('surveys', function() {
    return Surveys.find({owner_id: this.userId});
});

Meteor.publish('surveys_all', function() {
    return Surveys.find({}, {fields: {
            survey_title: 1,
            survey_body: 1,
            recipients: 1
        }
    });
});