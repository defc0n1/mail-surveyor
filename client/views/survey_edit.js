var urlRouteIdMail= function(routeName, id, mail){
  var params = {_id: id};
  if(mail){params.mail = mail;};
  return Router.routes[routeName].url(params);
};

Template.surveyEdit.helpers({
  'surveyName': function () {
    //todox better understand and handle missing survey, waitOn
    return this.survey ? surveyName(this.survey.survey_name) : "MISSING";
  }
});

Template.surveyEdit.events({
  'click #survey-save-btn': function (e) {
    e.preventDefault();
    var data = formToData(surveyEditableProperties);
    var surveyId = $('#survey-id-input').val();
    callMeteor('surveyUpdate', surveyId, data);
// todox fix tab loss issue
// loses the active tab if and only if actual update occurs > probably linked to reactivity somehow
// code below was a tentative to re-set active tab after update but did not work
//        var href = $('#survey-tabs').find('.active a').attr('href');
//        console.log("current tab="+href);
//        $('#survey-tabs').find('a[href="' + href + '"]').tab('show');
  }
});

Template.surveyMain.helpers({
  'urlFill': function () {return urlRouteIdMail('surveyFill', this._id);}
});

Template.surveyParticipants.helpers({
  'recipients': function () {return this.recipients;},
  'urlResults': function (id) {return urlRouteIdMail('surveyResults', id, this.recipient_mail);},
  'urlFill': function (id) {return urlRouteIdMail('surveyFill', id, this.recipient_mail);}
});

Template.surveyParticipants.events({
  'click .delete': function (e) {
    e.preventDefault();
    var surveyId = $('#survey-id-input').val();
    var mailToDel = e.target.getAttribute('data-mail');
    if (confirm("Delete this recipient (" + mailToDel + ")?")) {
      callMeteor('recipientDelete', surveyId, mailToDel);
    }
  }
});