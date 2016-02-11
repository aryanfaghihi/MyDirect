var app = angular.module('project', []);
app.controller('IndexAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  $scope.current_webpage = window.location.href;
}]);

