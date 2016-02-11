var app = angular.module('project', []);
app.controller('RedirectAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  var id = window.location.pathname.split('/')[1];
  var data_obj = {
    id: id
  };
  $http.post('/api/redirect', data_obj).then(function(res) {
    console.log(res);
    var org_url = res.data;
    window.location.href = org_url;
  });

}]);