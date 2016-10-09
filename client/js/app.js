
var app = angular.module('app', ['ngRoute', 'lbServices', 'LocalStorageModule']);

app.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.when('/', {
			title: 'login',
			templateUrl: 'views/login.html',
			controller: 'loginCtrl'
		}).when('/login', {
			title: 'login',
			templateUrl: 'views/login.html',
			controller: 'loginCtrl'
		}).when('/orders', {
			title: 'orders',
			templateUrl: 'views/orders.html',
			controller: 'ordersCtrl',
			auth: true
		});
}]);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('orders');
});

app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push(function ($q) {
		return {
			'responseError': function (rejection) {
				var defer = $q.defer();
				if (rejection.status == 401) {
					window.location.href = "#/login";
				}
				defer.reject(rejection);
				return defer.promise;
			}
		};
	});
}]);

app.run(function ($location, $rootScope, $route, localStorageService) {
	$rootScope.$on('$locationChangeStart', function (evt, next, current) {
		var nextPath = $location.path(),
			nextRoute = $route.routes[nextPath];
		if (nextRoute && nextRoute.auth && !localStorageService.get('auth')) {
			window.location.href = "#/login"
		}
	});
});

// controllers

angular.module('app').controller('ordersCtrl', function ($scope, $route, User, $location, localStorageService) {
	$scope.logOut = function(){
			localStorageService.set('auth',false);
			localStorageService.set('role',false);
			$location.path('login/')
	}
});

angular.module('app').controller('loginCtrl', function ($scope, $route, User, $location, localStorageService) {
	$scope.login = function () {
		var data = {
			"username": $scope.username,
			"password": $scope.password
		};
		User.login(data,
			function (token) {
				localStorageService.set('auth', true);
				localStorageService.set('role', token.user.role);
				localStorageService.set('login', $scope.username);
				$location.path("/orders");
			},
			function (error) {
				if (error.data && error.data.error && error.data.error.message){
					$scope.loginError = error.data.error.message;
				}
			})
	};
});

