/**
 * Created by xinpan on 06/10/2015.
 */

angular.module('fiberApp').controller('fiberCtrl', function ($scope, $http) {
    $http.get('/user/profile').success(function (data, status, headers, config) {
        $scope.user = data;
        $scope.error = "";
    }).error(function (data, status, headers, config) {
        $scope.user = {};
        $scope.error = data;
    });
    console.log($scope.user);
});