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
            //todox handle case of notFound (route rule exists)
            //todox check user authorized to edit (could have just fill rights)
            var templateData = {
                    survey: Surveys.findOne(this.params._id)
            };
            return templateData;
        }
    });
    this.route('surveyFill', {
        path: '/:_id/:mail?',
        layoutTemplate: 'layoutFill',
        data: function() {
            var templateData = {
                _id: this.params._id,
                survey: Surveys.findOne(this.params._id),
                mail: this.params.mail ? decodeURI(this.params.mail) : this.params.mail
            };
            return templateData;
        }
    });
});