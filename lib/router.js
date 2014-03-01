Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('surveysList', {
        path: '/',
        data: function() {
            var templateData = {surveys: Surveys.find({},{sort: {created_at: -1}})};
            return templateData;
        }
    });
    this.route('surveyEdit', {
        path: '/edit/:_id',
        data: function() {
            //todox check user authorized to edit
            var templateData = {
                    survey: Surveys.findOne(this.params._id)
            };
            return templateData;
        }
    });
    this.route('surveyFill', {path: '/:_id'});

});