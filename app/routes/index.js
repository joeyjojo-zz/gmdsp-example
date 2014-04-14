export default
Ember.Route.extend({
    model: function () {

        /*
         First get all the payees stored in the database against any payment type

         This is the equivalent sparql:


         */

        var siteDomain = "data.gmdsp.org.uk"
        var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
            + "SELECT DISTINCT ?payee ?payeeLabel WHERE {"
            + "?s a <http://reference.data.gov.uk/def/payment#Payment> . "
            + "?s <http://reference.data.gov.uk/def/payment#payee> ?payee . "
            + "?payee rdfs:label ?payeeLabel"
            + "} ORDER BY (?payeeLabel)";
        var url = "http://" + siteDomain + "/sparql.json?query=";
        url += encodeURIComponent(query);

        return Ember.$.getJSON(
            url,
            {},
            function(data){
                "use strict";
                var results = data["results"]["bindings"]
                var numOfResults = results.length;
                var nameArray = [];

                for (var i=0; i<numOfResults;i++){
                    nameArray.push(results[i]["payeeLabel"]["value"]);
                }
                console.log(nameArray);
                return nameArray;
            }
        );
    }
});
