Template.app.events({
    'click a[href^="/"]': function (e) {
        e.preventDefault();
        Backbone.history.navigate(e.currentTarget.pathname, true);
    }
});

var viewIs = function(viewName){
    return (Session.get('view')==viewName);
};

Template.app.helpers({
    view: function() {return Session.get('view');},
    isEdit: function() {return (viewIs('edit')||viewIs('new'));}
});

