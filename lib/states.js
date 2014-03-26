State = (function () {
  var my = {};

  my.StateTime = function(stateId, objectCollection, objectId) {
    this.stateId = stateId;
    this.createdAt = new Date();
    this.ownerId = Meteor.userId();
    this.objectCollection = objectCollection;
    this.objectId = objectId;
  };

  /*
   Changes obj state (saving old state to history pile) but does NOT save obj itself.
   This should be done quickly afterward to minimize risk of inconsistency.
   returns true if obj state was changed, false otherwise.
   */
  my.setState = function(stateId, collection, obj) {
    var result = false;
    if(obj.state) {
      if(obj.state.stateId !== stateId) {
        //todo archive previous state - set objectId then!
        obj.state.objectId = obj._id;
        var newState = new my.StateTime(stateId, collection._name, obj._id);
        obj.state = newState;
        result = true;
      }
    } else {

      var newState = new my.StateTime(stateId, collection._name, obj._id);
      obj.state = newState;
      result = true;
    }
    return result;
  }

  return my;
}());




/*
 Creates and return a new object with common tech fields (created_at and owner_id).
 */


