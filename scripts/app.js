/*
 * Let this be a global function, so whenever the device/cordova is ready, 
 * we will call it
 */
(function () {
    angular.module('bengrecipeapp', ['ngRoute'])

    /***********************************************************************
     * mainCtrl
     ***********************************************************************/
    .controller('mainCtrl', function ($scope) {
        $scope.name = "Bengali Recipe";
    })

    /***********************************************************************
     *homeCtrl
     ***********************************************************************/
    .controller('homeCtrl', function ($scope, $http, $routeParams, $location) {
        $scope.name = "Home Page";
        console.log($routeParams);       

        $http.get('data/recipe-list.json').then(function (res) {
            console.log(res);
            $scope.recipes = res.data;
        }, function (err) {
            console.log(err);
        });
    })

    /****************************************************************************
     * recipeCtrl
     ****************************************************************************/
    .controller('recipeCtrl', function ($scope, $http, $routeParams) {
        //console.log($routeParams);
        var fileUrl = "data/recipes/" + $routeParams.id + '.json';

        $http.get(fileUrl).then(function (res) {
            $scope.recipe = res.data;
        }, function (err) {
            console.log(err);
        });
    })

    /*****************************************************************************
     * The Route
     *****************************************************************************/
    .config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(false);
        //$locationProvider.hashPrefix('!');
        $routeProvider
        .when('/home', {
            templateUrl:'partials/home.html',
            controller: 'homeCtrl'
        })
        .when('/recipe/:id', {
            templateUrl:'partials/recipe.html',
            controller:'recipeCtrl'
        })
        .when('/', {
            redirectTo: '/home'
        })
        .otherwise({
            redirectTo: '/'
        });        
    }]);
})();