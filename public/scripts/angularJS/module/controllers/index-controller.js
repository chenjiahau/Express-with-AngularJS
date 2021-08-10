var ctrl = function ($scope) {
  $scope.owner = "Ivan Chen";
  $scope.description = "A project fot testing, called Test Mode App";
}

ctrl.$inject = ['$scope'];
angular.module('TestModeApp').controller('IndexController', ctrl)