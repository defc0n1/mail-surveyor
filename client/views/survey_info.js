/**
 * Created by xavier on 2/21/14.
 */

Template.surveyInfo.events({ 'click .toggle': function(e){
    e.preventDefault();
    $(e.target).toggleClass('folded')
    $('#survey').toggleClass('hidden');
}
});