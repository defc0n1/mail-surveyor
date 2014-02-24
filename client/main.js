/**
 * Created by xavier on 2/20/14.
 */
Meteor.subscribe("recipients");
Meteor.subscribe("surveys");

MyRouter = Backbone.Router.extend({
    routes: {
        '': 'list',
        'new': 'new',
        'edit/:id': 'edit',
        ':id': 'fill'
    },
    list: function(){
        Session.set('view','list');
    },
    new: function(){
        Session.set('view','new');
        Session.set('surveyId', undefined);
    },
    edit: function(id){
        Session.set('view','edit');
        Session.set('surveyId',id);
    },
    fill: function(id){
        Session.set('view','fill');
        Session.set('surveyId',id);
    }
});

Meteor.startup(function(){
    new MyRouter;
    Backbone.history.start({pushState: true});
});