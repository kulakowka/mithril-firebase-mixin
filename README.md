# mithril-firebase-mixin

Mixin for mithril controllers to enable firebase livedata

```javascript
import m from 'mithril'
import firebaseMixin from 'mithril-firebase-mixin'


// Acquiring a Firebase DB Ref.
var config = {
  apiKey: "Your APP's API KEY",
  authDomain: "<Your App>.firebaseapp.com",
  databaseURL: "https://<Your App>.firebaseio.com",
  storageBucket: "",
};
var yourAppInstance = firebase.initializeApp(config);

var firebaseDBDataRef = yourAppInstance.database().ref('<your base path>');

// Sample mithril app usage

var SampleMithrilApp = {};

SampleMithrilApp.controller = function(args) {
  var scope = mixinFirebase(this);
  console.log('scope=', scope, this);
  scope.onlivedata(args.firebase, function(data) {
    console.log('scope.onLivedata:', data);
    scope.customers = data;
  });
};

SampleMithrilApp.view = function(ctrl) {

  return m('ul', ctrl.customers.map(function(customer) {
    return m('li', {
      key: customer._id
    }, customer.name);
  }));
};

m.module(document.body, {
	controller: function() {
		/* Needed to pass arguments to the controller*/
		return new SampleMithrilApp.controller({firebase: firebaseDBDataRef});
	},
	view: SampleMithrilApp.view
});

```
