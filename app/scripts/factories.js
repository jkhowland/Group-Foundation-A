foundationApp
  .service('GlobalConfig', function () {
    var service = {
      endpoint: '',
      init: function (endpoint) {
        service.endpoint = endpoint;
      }
    };

    return service;
  })
  .service("User", function (fbURL, $firebase) {
    return $firebase(new Firebase(fbURL)).$asArray();
  })
  .service('UserGroup', ['$firebase', '$q', 'userPromise', 'GlobalConfig', function($firebase, $q, userPromise, GlobalConfig) {
    var groupsURL = new Firebase(GlobalConfig.endpoint + 'groups/');
    var groups = function () {
      var deferred = $q.defer();
      var all_groups = $firebase(groupsURL).$asArray();
      all_groups.$loaded().then(function () {
        deferred.notify('Get all user groups');
        deferred.resolve(all_groups);
      });

      return deferred.promise;
    };

    var currentPromise = function () {
      var deferred = $q.defer();
      groups().then(function (all_groups) {
        deferred.notify('get default group');
        deferred.resolve(all_groups[0]);
      });
      //return promise
      return deferred.promise;
    };

    var updatePromise = function(groupInfo) {
      var deferred = $q.defer();
      groupInfo.$save().then(function() {
        deferred.notify('update group info');
        deferred.resolve({});
      });
      //return promise
      return deferred.promise;
    };

    var getGroup = function(gid) {
      var deferred = $q.defer();
      var groupUrl = new Firebase(GlobalConfig.endpoint + 'groups/'+gid);
      var group = $firebase(groupUrl).$asObject();
      group.$loaded().then(function(){
        deferred.notify('get user group by ' + gid);
        deferred.resolve(group);
      });
      return deferred.promise;
    };

    var addGroup = function(groupInfo) {
      var deferred = $q.defer();
      var Group = $firebase(groupsURL).$asArray();
      Group.$add(groupInfo).then(function() {
        deferred.notify('added a new group');
        deferred.resolve({});
      });
      return deferred.promise;
    };

    var removeGroup = function(gid) {
      var deferred = $q.defer();
      var Group = $firebase(groupsURL).$asArray();
      Group.$remove(Group[gid]).then(function(){
        deferred.notify('removed group');
        deferred.resolve({});
      });
    };

    return {
      groups: groups,
      current: currentPromise,
      update: updatePromise,
      get: getGroup,
      add: addGroup,
      remove: removeGroup
    };
  }])
  .service("simpleLogin", ['$firebaseSimpleLogin', '$firebase', 'GlobalConfig', function($firebaseSimpleLogin, $firebase, GlobalConfig){
    var ref = new Firebase(GlobalConfig.endpoint);
    var authProvider = $firebaseSimpleLogin(ref);
    return authProvider;
  }])
  .service("userPromise", ['simpleLogin', '$firebase', '$q', 'GlobalConfig', function(simpleLogin, $firebase, $q, GlobalConfig) {
    //function returnPromise will generate a promise that will get the authenticated user, make a profile if it doesn't exist,
    //and then return both objects on resolution.
    var returnPromise = function(){
      var user, publicUser;
      var deferred = $q.defer();

      //this function will take a user object and check for existing profile "publicUser" and create it if not
      var getPublicUser = function(auth_user){
        var ref = new Firebase(GlobalConfig.endpoint);
        var remoteUser = $firebase(ref.child('users').child(auth_user.uid)).$asObject();
        remoteUser.$loaded().then(function(){
          if (remoteUser.profile){
            deferred.notify('Existing public profile');
            publicUser = remoteUser;
            deferred.resolve({user: user, publicUser: publicUser});
          } else {
            deferred.notify('New user - initializing profile');

            // remoteUser.profile_img_url = auth_user.thirdPartyUserData.profile_image_url;
            remoteUser.profile = {
              username: '',
              phone: '',
              isadmin: false,
              groupid: ''
            };
            remoteUser.$save(function(){console.log('successfully saved')});  //save to firebase
            publicUser = remoteUser;
            deferred.resolve({user: user, publicUser: publicUser});
          }
        });
      };

      //get the authenticated user
      simpleLogin.$getCurrentUser().then(function(userData){
        if(userData){
          deferred.notify('User ' + userData.id + " successfully logged in through simpleLogin");
          user = userData;
          //if authenticated, get the public object
          getPublicUser(userData);
        } else {
          deferred.reject('Not authenticated')
        }
      });

      //return promise
      return deferred.promise;
    };
    //return function to generate the promise. We return a function instead of
    //the promise directly so they can regenerate the promise if they fail authentication.
    return {getPromise: returnPromise};
  }]);