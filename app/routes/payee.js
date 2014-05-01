export default

Ember.Route.extend({
    model: function (params) {
        return Ember.RSVP.hash({
            organisation: function(){
                "use strict";
                var siteDomain = "data.gmdsp.org.uk"
                var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
                    + "SELECT DISTINCT ?payeeLabel WHERE {"
                    + "<" + decodeURIComponent(params.payee_id) + "> rdfs:label ?payeeLabel }"
                var url = "http://" + siteDomain + "/sparql.json?query=";
                url += encodeURIComponent(query);

                return new Ember.RSVP.Promise(function(resolve, reject) {
                    Ember.$.getJSON(url).then(function(data){
                        var results = data["results"]["bindings"];
                        resolve({
                            id: params.payee_id,
                            label: results[0]["payeeLabel"]["value"]
                        });
                    });
                });
            }(),
            transactions: function(){
                "use strict";
                var siteDomain = "data.gmdsp.org.uk"
                var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
                    + "SELECT DISTINCT ?expenditureLine ?expenditureLabel ?amount WHERE {"
                    + "?s a <http://reference.data.gov.uk/def/payment#Payment> ."
                    + "?s <http://reference.data.gov.uk/def/payment#payee> <http://data.gmdsp.org.uk/id/manchester/payee/British-Gas-Business> ."
                    + "?s <http://reference.data.gov.uk/def/payment#expenditureLine> ?expenditureLine ."
                    + "?expenditureLine <http://reference.data.gov.uk/def/payment#netAmount> ?amount ."
                    + "?expenditureLine rdfs:label ?expenditureLabel }";
                var url = "http://" + siteDomain + "/sparql.json?query=";
                url += encodeURIComponent(query);

                return new Ember.RSVP.Promise(function(resolve, reject) {
                    Ember.$.getJSON(url).then(function(data){
                        var results = data["results"]["bindings"];
                        var numOfResults = results.length;
                        var resultArray = [];
                        for (var i=0; i<numOfResults;i++){
                            resultArray.push({
                                id: results[i]["expenditureLine"]["value"],
                                label: results[i]["expenditureLabel"]["value"],
                                amount: numeral().unformat(results[i]["amount"]["value"])
                            });
                        }
                        resolve(resultArray);
                    });
                });
            }()
        });

    }
});
