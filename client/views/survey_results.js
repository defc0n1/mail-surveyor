Template.surveyResults.helpers({
  'result': function(){
    var rec = getRecipient(this.survey, this.recipient_mail);
    if(!rec) return;
    var resultHash = rec.recipient_result;
    var result = [];
    for (var key in resultHash) {
      result.push(""+key+"= "+resultHash[key]);
    }
    return result;
  }
});