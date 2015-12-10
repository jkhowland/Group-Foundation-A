"use strict";

var foundationApp = angular
  .module("foundationApp", [
    "ngAnimate",
    "ngCookies",
    "ngResource",
    "ngRoute",
    "ngSanitize",
    "ngTouch",
    "firebase"
  ]);
foundationApp
  .run(function( GlobalConfig ){
    GlobalConfig.init("https://foundation-app.firebaseio.com/");
  })
  .value("fbURL", "https://foundation-app.firebaseio.com/")
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
      })
      .when("/edit/:id", {
        templateUrl: "views/edit.html",
        controller: "EditCtrl",
        resolve: {
          "currentUser": function(userPromise, $location) {
              return userPromise.getPromise().then(function(success){
                return success;
              }, function(reason){
                console.log("userPromise Failed: " + reason);
                $location.path('/login');
              }, function(notification){
                console.log("notification: " + notification);
              });
            }
        }
      })
      .when("/edit_group/:id", {
        templateUrl: "views/edit_group.html",
        controller: "EditGroupCtrl"
      })
      .when("/login", {
        templateUrl: "views/user/login.html",
        controller: "LoginCtrl"
      })
      .when("/register", {
        templateUrl: "views/user/register.html",
        controller: "RegisterCtrl",
        resolve: {
          "currentUser": function(userPromise, $location, simpleLogin) {
            return userPromise.getPromise().then(function(success){
              simpleLogin.$logout();
            }, function(reason){
              $location.path('/register');
            }, function(notification){
              $location.path('/register');
            });
          }
        }
      })
      .when("/logout", {
        resolve: {
          "currentUser": function(userPromise, $location, simpleLogin) {
            return userPromise.getPromise().then(function(success){
              simpleLogin.$logout();
            }, function(reason){
              $location.path('/login');
            }, function(notification){
              $location.path('/login');
            });
          }
        }
      })
      .when("/groups", {
        templateUrl: "views/groups.html",
        controller: "GroupsCtrl",
        resolve: {
          "currentUser": function(userPromise, $location) {
            return userPromise.getPromise().then(function(success){
              return success;
            }, function(reason){
              console.log("userPromise Failed: " + reason);
              $location.path('/login');
            }, function(notification){
              console.log("notification: " + notification);
            });
          }
        }
      })
      .otherwise({
        redirectTo: "/login"
      });
  });
