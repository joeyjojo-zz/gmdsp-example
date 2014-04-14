
var Router = Ember.Router.extend();

Router.map(function(){
    this.resource('payee', { path: '/payee/:payee_id' });
});

export default Router;

