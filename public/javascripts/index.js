var app = angular.module('project', []);
app.controller('IndexAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  // Get the current webpage's url.
  $scope.current_webpage = window.location.href;

  // POST request to get the shortened URL
  $scope.submit_url = function (url) {
    var url_json = {
      url: url
    };
    $http.post('/api/new/', url_json).then(function (res) {
      console.log(res);
    })
  }

}]);

