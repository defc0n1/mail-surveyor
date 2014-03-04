Router.configure({
  layoutTemplate: 'layout'
});

var getSurveyAndRecipient = function(params) {
  var surveyId = params.survey_id;
  var recipientId = params.recipient_id;
  var result= {};
  if(surveyId) {
    var s = Surveys.findOne(surveyId);
    result.survey = s;
  }
  if(recipientId) { result.recipient = Recipients.findOne(recipientId);}
  return result;
};

Router.map(function () {
  this.route('surveysList', {
    path: '/',
    waitOn: function () {
      return Meteor.subscribe("surveysOfUser");
    },
    data: function () {
      var userId = Meteor.userId();
      // important - without the test we pass null, which is interpreted as no criteria and returns ALL survey stubs from the fill subscription > ugly!!!
      var s = userId ? Surveys.find({owner_id: userId}, {sort: {created_at: -1}}) : [];
      return {surveys: s};
    }
  });
  this.route('surveyEdit', {
    path: '/edit/:survey_id',
    waitOn: function () {
      var subs = [
        Meteor.subscribe("surveysOfUser"),
        Meteor.subscribe('recipientsOfSurvey', this.params.survey_id)
      ];
      return subs;
    },
    data: function () {
      //todox handle case of notFound (route rule exists)
      return getSurveyAndRecipient(this.params);
    }
  });

// public route
  this.route('surveyResults', {
    path: '/result/:survey_id/:recipient_id',
    layoutTemplate: 'layoutFill',
    waitOn: function () {
      var surveyId = this.params.survey_id;
      var recipientId = this.params.recipient_id;
      var subs = [
        Meteor.subscribe('surveyToFill', surveyId),
        Meteor.subscribe('recipientById', recipientId)
      ];
      return subs;
    },
    data: function () {
      return getSurveyAndRecipient(this.params);
    }
  });


  this.route('surveyFill', {
    path: '/:survey_id/:recipient_id?',
    layoutTemplate: 'layoutFill',
    waitOn: function () {
      var surveyId = this.params.survey_id;
      var recipientId = this.params.recipient_id;
      var subs = [Meteor.subscribe('surveyToFill', surveyId)];
      if(recipientId) {
        subs.push(Meteor.subscribe('recipientById', recipientId));
      }
      return subs;
    },
    data: function () {
      return getSurveyAndRecipient(this.params);
    }
  });
});