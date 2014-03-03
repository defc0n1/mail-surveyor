Template.layout.helpers({
  'surveysShortList': function(){
    // return last 10 surveys (or less)
    return Surveys.find({owner_id: Meteor.userId()},{sort: {created_at: -1}, limit: surveysShortListLength});
  },
  'hasMoreSurveys': function(){
    return Surveys.find({owner_id: Meteor.userId()},{limit: (surveysShortListLength+1)}).count() > surveysShortListLength;
  },
  'name': function(){
    return surveyName(this.survey_name);
  }
});