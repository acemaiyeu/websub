app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../client/home.html',
            controller: 'HomeController'
        })
        .when('/sub/:id', {
            templateUrl: '../client/detail.html',
            controller: 'HomeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});