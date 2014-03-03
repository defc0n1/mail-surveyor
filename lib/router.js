Router.configure({
  layoutTemplate: 'layout'
});

/*
extracts survey id and opional mail, fetches survey (can be restrained to owned), and packages all in a hash.
 */
var getOneSurvey = function(params, includeNonOwned) {
  var surveyId = params._id;
  var mail = params.mail ? decode(params.mail) : params.mail;
  var userId = Meteor.userId();
  var s = undefined;
  if(includeNonOwned || userId) {
    var criteria = {_id: surveyId};
    if(!includeNonOwned) {
      criteria['owner_id'] = userId;
    }
    s = Surveys.findOne(criteria);
  }
  return {
    _id: surveyId,
    survey: s,
    recipient_mail: mail
  };
};

Router.map(function () {
  this.route('surveysList', {
    path: '/',
    data: function () {
      var userId = Meteor.userId();
      // important - without the test we pass null, which is interpreted as no criteria and returns ALL survey stubs from the fill subscription > ugly!!!
      var s = userId ? Surveys.find({owner_id: userId}, {sort: {created_at: -1}}) : [];
      return {surveys: s};
    }
  });
  this.route('surveyEdit', {
    path: '/edit/:_id',
    data: function () {
      //todox handle case of notFound (route rule exists)
      return getOneSurvey(this.params, false);
    }
  });
  this.route('surveyResults', {
    path: '/result/:_id/:mail?',
    data: function () {
      return getOneSurvey(this.params, false);
    }
  });

// public route
  this.route('surveyFill', {
    path: '/:_id/:mail?',
    waitOn: function () {
      return Meteor.subscribe('surveyToFill', this.params._id, decode(this.params.mail));
    },
    layoutTemplate: 'layoutFill',
    data: function () {
      return getOneSurvey(this.params, true);
    }
  });
});