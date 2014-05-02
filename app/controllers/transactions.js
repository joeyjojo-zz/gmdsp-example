var TransactionsController = Ember.ArrayController.extend({
    getTransactionTotal: function(){
        "use strict";
        return "200.00";
    }.property("getTransactionTotal")
});

export default TransactionsController;