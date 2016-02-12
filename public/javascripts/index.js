var app = angular.module('project', []);
app.controller('IndexAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  // Get the current webpage's url.
  $scope.current_webpage = window.location.href;
  $scope.short_url = $scope.current_webpage;
  $scope.short_url_is_visible = false;
  $scope.short_url_success = false;

  // POST request to get the shortened URL
  $scope.submit_url = function (url) {

    var url_json = {
      url: url,
      id: create_id()
    };
    $http.post('/api/new/', url_json).then(function (res) {
      console.log(res.data);
      $scope.short_url_is_visible = true;
      $scope.short_url = $scope.current_webpage + res.data;
    })
  };

  $scope.update_url = function(dest_url) {
    var new_id = $scope.short_url.split('/')[3];
    console.log(new_id);
    var url_json = {
      url: dest_url,
      id: new_id
    };
    $scope.short_url_success = false;
    $http.post('/api/update/', url_json).then(function (res) {
      console.log(res.data);
      $scope.short_url = $scope.current_webpage + res.data;
      $scope.short_url_success = true;
    })
  };

  $scope.copy_to_clipboard = function() {
    var mate = document.getElementById('short_url');
    mate.select();
    //$('#short_url').click();
    document.execCommand('copy');
  };

  $scope.short_url_change = function() {
    // Prevent the user from removing the current webpage's address.
    if ($scope.short_url.substr(0, $scope.current_webpage.length) !== $scope.current_webpage) {
      $scope.short_url = $scope.current_webpage;
    }
  };

  function create_id() {
    return Math.random().toString(36).substr(2, 4);
  }
}]);