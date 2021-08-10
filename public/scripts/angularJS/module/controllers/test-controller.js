var ctrl = function ($scope) {
  $scope.title = "Test";
}

ctrl.$inject = ['$scope'];
angular.module('TestModeApp').controller('TestController', ctrl)