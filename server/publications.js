Meteor.publish('surveysOfUser', function () {
  return Surveys.find({owner_id: this.userId});
});

Meteor.publish('surveyToFill', function (surveyId, mail) {
  if(!surveyId) {return undefined;}
  check(surveyId, String);
//  console.log("publish.surveyToFill("+surveyId+", "+mail+")");
  return Surveys.find({_id: surveyId}, {fields: {
    survey_title: 1,
    survey_body: 1,
    //todox do better - we're still fetching all recipients, just to display one name...
    recipients: 1
    }
  });
});