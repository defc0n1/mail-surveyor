Template.app.events({
    'click a[href^="/"]': function (e) {
        e.preventDefault();
        Backbone.history.navigate(e.currentTarget.pathname, true);
    }
});

if (!window.mailSurveyor) {
    window.mailSurveyor = {
    };
}

if (!window.mailSurveyor.const) {
    window.mailSurveyor.const = {
        VIEW_LIST: "list",
        VIEW_EDIT: "edit",
        VIEW_FILL: "fill"
    };
}

var viewIs = function (viewName) {
    return (window.mailSurveyor.current_view == viewName);
};
var msc = window.mailSurveyor.const;

Template.app.helpers({
    view: function () {
        return window.mailSurveyor.current_view;
        //return Session.get('view');
    }, // debug only
    isList: function () {
        return (viewIs(msc.VIEW_LIST));
    },
    isEdit: function () {
        return (viewIs(msc.VIEW_EDIT));
    },
    isFill: function () {
        return (viewIs(msc.VIEW_FILL));
    }
});

