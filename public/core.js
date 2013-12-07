var goodEatsApi = angular.module('goodEatsApi', []);

function mainController($scope, $http) {
	$scope.formData = {};

	$scope.initialize = function() {
		$http.get('/api/restaurants')
			.success(function(data) {
				$scope.restaurants = data;
				console.log(data);
			})
			.error(function(data) {
				console.log("Error: " + data);
			});
	};

}