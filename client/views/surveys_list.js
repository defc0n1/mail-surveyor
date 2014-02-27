
Template.surveysList.events({
    'click #btn-new-survey': function (e) {
        e.preventDefault();
        var survey = {
            created_at: new Date(),
            owner_id: Meteor.userId(),
            mail: Meteor.user().emails[0].address
        }
        survey._id = Surveys.insert(survey);
        //Backbone.history.navigate("edit/"+survey._id, true);
        Router.go('surveyEdit', {_id: survey._id})
    },
    'click .delete': function (e) {
        e.preventDefault();
        var idDel = e.target.id;
        var surv = Surveys.findOne(idDel);
        //console.log(idDel);
        if (confirm("Delete this survey ("+surv.name+")?")) {
            Surveys.remove(idDel);
        }
    }/*,
    'click .edit': function (e) {
        e.preventDefault();
        var idEdit = e.target.id;
        var rec = Surveys.findOne(idEdit);
        //todo check exists + user authorized to edit
        Backbone.history.navigate("edit/"+idEdit);
    }*/
});