Meteor.publish('surveysOfUser', function () {
  return Surveys.find({owner_id: this.userId});
});

Meteor.publish('recipientsOfSurvey', function (surveyId) {
  return Recipients.find({owner_id: this.userId, survey_id: surveyId});
});

/*
PUBLIC - does not require logged in user.
 */
Meteor.publish('surveyToFill', function (surveyId) {
  if(!surveyId) {return undefined;}
  check(surveyId, String);
//  console.log("publish.surveyToFill("+surveyId+", "+mail+")");
  return Surveys.find({_id: surveyId}, {fields: {
    survey_title: 1,
    survey_body: 1
    }
  });
});

/*
PUBLIC - does not require logged in user.
 */
Meteor.publish('recipientById', function(recipientId){
  if(!recipientId) {return undefined;}
  return Recipients.find({_id: recipientId});
});