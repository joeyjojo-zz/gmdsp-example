export default
Ember.Route.extend({
    model: function () {

        var siteDomain = "data.gmdsp.org.uk"
        var query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
            + "SELECT DISTINCT ?payee ?payeeLabel WHERE {"
            + "?s a <http://reference.data.gov.uk/def/payment#Payment> . "
            + "?s <http://reference.data.gov.uk/def/payment#payee> ?payee . "
            + "?payee rdfs:label ?payeeLabel"
            + "} ORDER BY (?payeeLabel)";
        var url = "http://" + siteDomain + "/sparql.json?query=";
        url += encodeURIComponent(query);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(url).then(function(data){
                var results = data["results"]["bindings"]
                var numOfResults = results.length;
                var nameArray = [];

                for (var i=0; i<numOfResults;i++){
                    nameArray.push({
                        id: results[i]["payee"]["value"],
                        label: results[i]["payeeLabel"]["value"]
                    });
                }
                resolve(nameArray);
            });
        });
    }
});
/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?expenditureLine ?expenditureLabel ?amount
WHERE {
  ?s a <http://reference.data.gov.uk/def/payment#Payment> .
  ?s <http://reference.data.gov.uk/def/payment#payee> <http://data.gmdsp.org.uk/id/manchester/payee/British-Gas-Business> .
  ?s <http://reference.data.gov.uk/def/payment#expenditureLine> ?expenditureLine .
  ?expenditureLine <http://reference.data.gov.uk/def/payment#netAmount> ?amount .
  ?expenditureLine rdfs:label ?expenditureLabel
}
*/