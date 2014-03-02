/**
 * Created by xavier on 2/21/14.
 */

// no var so that the collection is global and available to all
Surveys = new Meteor.Collection('surveys');

Meteor.methods({
  saveSurveyResult: function(data) {
    //todox check survey and mail - esp if new mail, create recipient w/ dummy name
    //todox survey setup parameter: allow new recipients or not.
    Surveys.update(
        {_id: data.surveyId, "recipients.mail": data.recipientMail},
        {$set: {"recipients.$.result" : data.result}});
  }
});
