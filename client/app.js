'use strict';

var app = angular.module('presentations', ['ngRoute', 'satellizer', 'mm.foundation', 'mm.foundation.topbar']);

app.config(function($authProvider) {
  $authProvider.oauth2({
    url: '/auth/hackerschool',
    name: 'hackerschool',
    clientId: '72aa70483fe6f57052b428bc1f99932d87234232190444567189bec28aec5dae',
    authorizationEndpoint: 'https://www.hackerschool.com/oauth/authorize',
    redirectUri: "http://thursday-presentations.herokuapp.com"
  });
});

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/presentation.html',
      controller: 'PresentationController'
    })
    .when('/login', {
      controller: 'LoginController'
    })
    .when('/logout', {
      resolve: {
        logout: ['$location', '$auth', function($location, $auth) {
          $auth.logout();
          return $location.path('/');
        }]
      }
    })
    .otherwise({
      redirectTo: '/'
    });
}]);


app.controller("AuthController", function($scope, $auth, $location) {
  $scope.isAuthenticated = $auth.isAuthenticated;
});

app.controller("PresentationController", function($scope, $auth, $location, $http) {
  $scope.isAuthenticated = $auth.isAuthenticated;

  var date = new Date();
  $scope.isThursday = date.getDay() === 2;

  $http.get('/api/list')
    .success(function(data, status, headers, config) {
      $scope.list = data;
    });

  function updateTotalTime() {
    $http.get('/api/totaltime')
      .success(function(data, status, headers, config) {
        $scope.totalTime = data.totaltime;
      });
  }

  $http.get('/api/user/me')
    .success(function(data, status, headers, config) {
      $scope.currentUser = data;
    });

  $scope.duration = 5;

  $scope.addPresentation = function(){
    var presentation = {
      'duration': parseInt($scope.duration, 10)
    };

    $http.post('/api/add', presentation)
      .success(function(data, status, headers, config) {
        if (!data.error) {
          $http.get('/api/list')
            .success(function(data, status, headers, config) {
              $scope.list = data;
              $scope.alreadyPresenting = presenting();
              updateTotalTime();
            });
        }
      });
  };

  $scope.cancelPresentation = function() {
    $http.post('/api/cancel')
      .success(function(data, status, headers, config){
        if (!data.error) {
          $http.get('/api/list')
            .success(function(data, status, headers, config) {
              $scope.list = data;
              $scope.alreadyPresenting = presenting();
              updateTotalTime();
            });
        }
      });
  };

  function presenting() {
    $http.get('/api/presenting')
      .success(function(data, status, headers, config){
        $scope.alreadyPresenting = data.presenting;
      });
  }
  $scope.alreadyPresenting = presenting();
});


app.controller("LoginController", function($scope, $auth, $location) {

  $scope.isAuthenticated = $auth.isAuthenticated();

  $scope.$watch('isAuthenticated', function(isAuthenticated) {
    if (isAuthenticated){
      $location.path('/');
    }
  });

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider).then(function(argument) {
      $scope.isAuthenticated = true;
    });
  };

});
