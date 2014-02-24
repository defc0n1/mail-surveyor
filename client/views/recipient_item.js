/**
 * Created by xavier on 2/21/14.
 */
Template.recipientItem.helpers({ domain: function () {
    var pattern = /@(.*)/;
    var matches = pattern.exec(this.mail);
    return matches[1];
} });

Template.recipientItem.events({ 'click .delete': function (e) {
    e.preventDefault();
    var idDel = e.target.id;
    var rec = Recipients.findOne(idDel);
    //console.log(idDel);
    if (confirm("Delete this recipient ("+rec.mail+")?")) {
        Recipients.remove(idDel);
    }
} });
