var app = angular.module("TestModeApp", ["ngRoute"]);
app.config(function($routeProvider) {
  $routeProvider
    .when("/", {})
    .when("/test", {})
});