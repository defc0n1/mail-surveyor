/**
 * Created by xavier on 2/21/14.
 */

Template.surveyActions.events({ 'click .toggle': function (e) {
    e.preventDefault();
    $(e.target).toggleClass('folded')
    $('#sendMail').toggleClass('hidden');
},
    'click .btn': function (e) {
        e.preventDefault();
        alert("Clicked on " + e.target);
    }
});