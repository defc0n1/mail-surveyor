Template.surveysList.events({
  'click #btn-new-survey': function (e) {
    e.preventDefault();
    callMeteor('surveyCreate', null, null, 'surveyEdit');
  },
  'click .delete': function (e) {
    e.preventDefault();
    var surveyId = e.target.getAttribute('data-survey');
    var surv = Surveys.findOne({_id: surveyId});
    if (confirm("Delete this survey (" + surv.survey_name + ")?")) {
      callMeteor('surveyDelete', surveyId);
    }
  }
});

Template.surveyItem.helpers({
  'count': function () {
    return this.recipients ? this.recipients.length : 0;
  },
  'name': function () {
    return surveyName(this.survey_name);
  },
  'created_at': function () {
    return dateFormat(this.created_at, 'mmm d, yyyy');
  }
});