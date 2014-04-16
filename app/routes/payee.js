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
            }
        });

    }
});
