appAdmin.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../admin/home.html',
            controller: 'HomeController'
        })
        .when('/videos', {
            templateUrl: '../admin/video_list.html',
            controller: 'VideoController'
        })
        .when('/video-create', {
            templateUrl: '../admin/video_create.html',
            controller: 'VideoController'
        })
        .otherwise({
            redirectTo: '/'
        });
});