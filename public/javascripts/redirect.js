var app = angular.module('project', []);
app.controller('RedirectAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  var id = window.location.pathname.split('/')[1];

  var db_obj = {
    geo: {},
    device: {}
  };

  $http.get('http://ip-api.com/json/').then(function(res){
    if (res.data.status !== 'fail') {
      db_obj.geo = res.data;
      console.log(db_obj);
    }
    else {
      db_obj.geo = null;
    }

    $http.post('/api/redirect/' + id, db_obj).then(function(res) {
      console.log(res);
      var org_url = res.data;
      window.location.href = org_url;
    });
  })

}]);