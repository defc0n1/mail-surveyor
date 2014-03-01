/**
 * Created by xavier on 2/21/14.
 */
Meteor.publish('recipients', function() {
    return Recipients.find();
});

Meteor.publish('surveys', function() {
    return Surveys.find({owner_id: this.userId});
});