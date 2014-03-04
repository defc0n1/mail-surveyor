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
isOwner = function(userId, anObject) {
  return anObject && userId && anObject.owner_id === userId;
};

/*
 Throws an error unless user logged in, object with id exists in collection, and user owns it.
 So any code past this method can safely assume all is in order for safe object manipulation by user.
 If Id is null, just ensures that user logged in and returns undefined.
 Returns the existing object if all ok.
 */
ensureOwnership = function(collection, id, infoForLogging){
  if (!Meteor.userId())
    throw new Meteor.Error(401, "You need to be logged in to use this feature");
  var ownedObject = undefined;
  if(id){
    check(id, String);
    ownedObject = collection.findOne({_id: id, owner_id: Meteor.userId()});
    if(!isOwner(Meteor.userId(), ownedObject)) {
      if(isServer){
        cs('ownership violation userId '+id+' on', collection);
        cs('info provided by caller', infoForLogging);
      }
      throw new Meteor.Error(403, "Unauthorized action");
    }
  }
  return ownedObject;
}