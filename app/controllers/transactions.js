var TransactionsController = Ember.ArrayController.extend({
    getTransactionTotal: function(){
        "use strict";
        var transactions = this.get("content");
        return transactions.reduce(function(previousValue, transaction){
            return numeral(
                numeral().unformat(previousValue) + numeral().unformat(transaction.amount)
            ).format('£0.00');
        }, '£0.00');
    }.property()
});

export default TransactionsController;