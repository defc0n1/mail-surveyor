/*
Debug shortcut, dumps its arg to console
 */
s = function(obj) {
  return (JSON.stringify(obj));
};
/*
 Debug shortcut, dumps 2nd arg to console with prefix text
 */
cs = function(text, obj) {
  console.log(text +": " + s(obj));
};
/*
Debug shortcut, takes a method name and its 'arguments' array and dumps it all cleanly formatted to the console
 */
ca = function(methodName, methodArgs){
  console.log(methodName+" start");
  for(var i in methodArgs){
    cs("  ",methodArgs[i]);
  }
  console.log(methodName+" stop");
};

/*
decodes input, preserving null/undefined
 */
decode = function (input) {
  return input ? decodeURI(input) : input;
};

/*
 Creates and return a new object with common tech fields (created_at and owner_id).
 */
TimestampObject = function() {
  this.created_at = new Date();
  this.owner_id = Meteor.userId();
};


/*
sets all listed properties of target to source, and returns target, ensuring all propertiesr are String.
- properties can be either an Array, a String (single property), or null/undefined
(with hash source, in which case the method copies ALL fields).
- if target is null/undef, a new hash object is created, set, and returned
- source can be either one String value (all properties will be set to the same), or a hash of String
(target properties will be set to the value they have in source).
Important: properties not present in source will be LEFT AS IS in target (not removed).

returns target.
 */
setProperties = function(properties, target, source){
  // source must be either Object or String
  var isMultiValues = ((typeof source) == 'object');
  if(!isMultiValues){ check(source, String);}

  // if no properties use source.keys
  if(!properties) {
    if(isMultiValues) {
      properties = Object.keys(source);
    } else {
      properties = [];
    }
  }
  // properties must be either Array or String
  if(Object.prototype.toString.call(properties) !== '[object Array]'){
    check(properties, String);
    properties = [properties];
  }


  // if no target, we return a new hash
  var result = target ? target : {};

  for(var i in properties) {
    var property = properties[i];
    if(isMultiValues) {
      if(source.hasOwnProperty(property)) {
        var value = source[property];
        check(value, String);
        result[property] = value;
      }
    } else {
      result[property]= source;
    }
  }
  return result;
};