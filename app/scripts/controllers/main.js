angular.module('foundationApp')
  .controller('MainCtrl', function ($scope, User, $firebase, fbURL) {
    
  })
  .controller('EditCtrl', function ($scope, $location, $routeParams, $firebase, fbURL) {
    var userURL = new Firebase(fbURL + $routeParams.id);
    $scope.user = $firebase(userURL).$asObject();
    $scope.edit = function () {
      $scope.user.$save();
      $location.path('/');
    };
  })
  .controller('LoginCtrl', ['$scope', '$location', 'simpleLogin', function ($scope, $location, simpleLogin) {
    $scope.login = function() {
      simpleLogin.$login('password', {
        email: $scope.username,
        password: $scope.password
      })
        .then(function(user) {
          // Success callback
          $location.path("/groups")
        }, function(error) {
          // Failure callback
          console.log('Authentication failure');
        });
    };
  }])
  .controller('RegisterCtrl', function($scope, $location, $routeParams, simpleLogin){
    $scope.register = function() {
      simpleLogin.$createUser($scope.email, $scope.password)
        .then(function() {
          // do things if success
          simpleLogin.$login('password', {
            email: $scope.email,
            password: $scope.password
          })
            .then(function(user) {
              // Success callback
              user.profile = {
                userid: user.uid,
                username: '',

              };
            }, function(error) {
              // Failure callback
              console.log('Authentication failure');
            });
        }, function(error) {
          // do things if failure
          $scope.regError = true;
          $scope.regErrorMessage = error.message;
        });
    };
  })
  .controller('GroupsCtrl', function ($scope, $location, $routeParams, $firebase, UserGroup) {
    $scope.groups = {};
    UserGroup.groups().then(function(groups) {
      $scope.groups = groups;
      console.log( groups );
    });

    $scope.add = function () {
      UserGroup.add({
        groupName: $scope.groupName,
        isdefault: false
      });
    };

    $scope.remove = function(gid) {
      UserGroup.remove(gid).then(function(){
        alert('abc');
      });
    };
  })
  .controller('EditGroupCtrl', function ($scope, $location, $routeParams, UserGroup) {
    $scope.group = {};
    UserGroup.get($routeParams.id).then( function( group ) {
        $scope.group = group;
    });

    $scope.edit = function () {
      UserGroup.update($scope.group).then(function() {
        $location.path('/');
      });
    };
  });
