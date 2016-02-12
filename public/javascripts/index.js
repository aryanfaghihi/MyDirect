var app = angular.module('project', []);
app.controller('IndexAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  // This is to make life easier when working with local storage
  Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
  };
  Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
  };
  // Get the current webpage's url.
  $scope.current_webpage = window.location.href;
  $scope.short_url = $scope.current_webpage;
  $scope.short_url_is_visible = false;
  $scope.short_url_success = false;
  var short_url_ref = document.getElementById('short_url');

  // POST request to get the shortened URL
  $scope.submit_url = function (url) {

    var url_json = {
      original_url: url,
      id: create_id()
    };
    $http.post('/api/new/', url_json).then(function (res) {
      console.log(res.data);
      $scope.short_url_is_visible = true;
      $scope.short_url = $scope.current_webpage + res.data;

      // Updating the local storage
      add_urls_to_local_storage(url_json);
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

      // Update the stored urls in local storage

    })
  };

  $scope.copy_to_clipboard = function() {
    short_url_ref.select();
    document.execCommand('copy');
  };

  $scope.short_url_change = function() {
    // Prevent the user from removing the current webpage's address.
    if ($scope.short_url.substr(0, $scope.current_webpage.length) !== $scope.current_webpage) {
      $scope.short_url = $scope.current_webpage;
    }
  };
  /*
   * Get created URLs from local storage of the browser
   */
  function add_urls_to_local_storage (obj) {
    if (typeof(Storage) !== "undefined") {
      $scope.stored_urls.push(obj);
      localStorage.setObj("urls", $scope.stored_urls);
    }
  }

  // Get the previously saved urls from local storage.
  if (typeof(Storage) !== "undefined") {
    $scope.stored_urls = [];
    if (localStorage.getObj("urls")) {
      $scope.stored_urls = localStorage.getObj("urls");
    }
    console.log($scope.stored_urls);
  }

  function create_id() {
    return Math.random().toString(36).substr(2, 4);
  }
}]);