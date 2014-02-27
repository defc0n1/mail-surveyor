/**
 * Created by xavier on 2/20/14.
 */
Meteor.subscribe("recipients");
Meteor.subscribe("surveys");

var msc = window.mailSurveyor.const;

MyRouter = Backbone.Router.extend({
    routes: {
        '': 'list',
        'edit/:id': 'edit',
        ':id': 'fill'
    },
    list: function(){
        window.mailSurveyor.current_view = msc.VIEW_LIST;
    },
    edit: function(id){
        window.mailSurveyor.current_view = msc.VIEW_EDIT;
        window.mailSurveyor.survey = id;
    },
    fill: function(id){
        window.mailSurveyor.current_view = msc.VIEW_FILL;
        window.mailSurveyor.survey = id;    }
});

Meteor.startup(function(){
    new MyRouter;
    Backbone.history.start({pushState: true});
});