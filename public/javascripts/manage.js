var app = angular.module('project', []);
app.controller('ManageAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  var page_id = window.location.href.split('/')[4];
  console.log(page_id);
  // Get the required data for the page
  $http.get('/api/manage/' + page_id).then(function(res) {
    console.log(res);
  })

}]);