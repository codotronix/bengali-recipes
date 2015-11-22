/*
 * Let this be a global function, so whenever the device/cordova is ready, 
 * we will call it
 */
(function () {
    angular.module('bengrecipeapp', ['ngRoute', 'ngAnimate'])

    /*****************************************************************************
     * The Route
     *****************************************************************************/
    .config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('!');
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
    }])

    /***********************************************************************
     * mainCtrl
     ***********************************************************************/
    .controller('mainCtrl', ["$scope", function ($scope) {
        $scope.name = "Bengali Recipe";
    }])

    /***********************************************************************
     *homeCtrl
     ***********************************************************************/
    .controller('homeCtrl', ["$scope", "$http", "$routeParams", "$location", "recipeDB", function ($scope, $http, $routeParams, $location, recipeDB) {
        $scope.name = "Home Page";
        //console.log($routeParams);       

        recipeDB.getRecipes().then(function (res) {
            //console.log(res);
            $scope.recipes = res;
        }, function (err) {
            console.log(err);
        });
    }])

    /****************************************************************************
     * recipeCtrl
     ****************************************************************************/
    .controller('recipeCtrl', ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
        //console.log($routeParams);
        var fileUrl = "data/recipes/" + $routeParams.id + '.json';

        $http.get(fileUrl).then(function (res) {
            $scope.recipe = res.data;
        }, function (err) {
            console.log(err);
        });
    }])

    /*******************************************************************************
     * recipeDB service
     *******************************************************************************/
    .service('recipeDB', ["$q", "$http", function ($q, $http) {
    	var allRecipes = "";

    	this.updateRecipes = function () {
    		var deferred = $q.defer();
    		$http.get('data/recipe-list.json').then(function (res) {
            	//console.log(res);
            	allRecipes = res.data;
            	deferred.resolve(allRecipes);
        	}, function (err) {
            	console.log(err);
            	deferred.reject(err);
        	});
        	return deferred.promise;
    	};

    	this.getRecipes = function () {
    		var deferred = $q.defer();
    		if (allRecipes != "" && allRecipes.length > 0) {
    			console.log('Serving from previously read recipeDB...');
    			deferred.resolve(allRecipes);
    		} else {
    			this.updateRecipes().then(function () {
    				console.log('Serving from newly read recipeDB...');
    				deferred.resolve(allRecipes);
    			}, function (err) {
    				deferred.reject(err);
    			})
    		}
    		return deferred.promise;
    	};
    }])
    
})();