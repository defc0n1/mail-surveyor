mail-surveyor
=============

Mail surveys made easy (with a Meteor application).

Mail-surveyor is a web application that lets you define surveys and recipients, then mails the survey to the recipients.
It tracks their answers and provide you with a basic dashboard to follow-up.

I developed it as a way to validate software product ideas for my bootstrapped business,
its intended target is dozens to hundreds of participants, and single page with basic fields survey.
This is in no way a replacement for MailChimp or SurveyMonkey, but a nice personal alternative for SMB.

The current code runs securely, but the feature set is still missing some key elements (mail sending, graphic editor, results
dashboard), so I only recommend it for the very brave, curious, and slightly masochistic.
A live demo is available on http://mail-surveyor.meteor.com/ (you need to start by creating a user, top right).

Features
--------
The current code base allows you to define surveys (in raw HTML...) and add participants, and lets them answer the
surveys online, if you manually send them the links. Results can be crudely viewed, participant per participant.

Roadmap to 1.0 is as follows:

1. improve participant experience
  * when coming back to survey, load previously input fields
  * upon finish, nice warm fuzzy thank you
  * custom settings for everything displayed on survey (greeting, mail request, save button)
2. limit users creation in some way - when I'll deploy it on my server, I don't want the whole internet using it!
3. add a nice forms editor, raw HTML in a textarea gets old very quickly...
4. results dashboard and export
5. send invites directly to participants
6. celebrate!


Used libraries
--------------
Like all software, Mail-surveyor stands on the shoulders of giants (big and small), and is only possible thanks to the
work of all these talented people.

[Meteor](https://www.meteor.com/), for killer, next-gen web framework.

[Iron Router](https://github.com/EventedMind/iron-router), for proper url/templates routing.

[Bootstrap 3](http://getbootstrap.com/) and its [Meteor integration](https://github.com/mangasocial/meteor-bootstrap-3),
for an incredibly beautiful front-end framework.
All the beauty is theirs, the ugliness is me slowly learning it...

[Steven Levithan's date.format.js](http://blog.stevenlevithan.com/archives/date-time-format) for a _really_ compact
date formatting lib.

[Mark Otto's HTML/CSS guide](http://mdo.github.io/code-guide/), because you need consistency for sanity.