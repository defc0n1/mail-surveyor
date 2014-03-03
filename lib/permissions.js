/*
These drive both event handler (client) and safe copy (server) - how cool is that?
 */
surveyEditableProperties = [
  'survey_name',
  'mail_from',
  'mail_subject',
  'mail_body',
  'survey_title',
  'survey_body'
];
recipientEditableProperties = [
  'recipient_name',
  'recipient_mail'
];


/*
 check that the specified userId owns the survey
 */
isSurveyOwner = function(userId, survey) {
  return survey && userId && survey.owner_id === userId;
};

/*
 Throws an error unless user logged in and owner of survey.
 Returns the survey object if all ok.
 So any code past this method can safely assume all is in order for safe survey manipulation.
 */
ensureOwnership = function(surveyId){
  if (!Meteor.userId())
    throw new Meteor.Error(401, "You need to be logged in to use this feature");
  var survey
  if(surveyId){
    survey = Surveys.findOne({_id: surveyId, owner_id: Meteor.userId()});
    if(!isSurveyOwner(Meteor.userId(), survey))
      throw new Meteor.Error(403, "Incorrect survey/user combination");
  }
  return survey;
}