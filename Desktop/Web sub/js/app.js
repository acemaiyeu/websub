const apiUrl = "http://localhost:8888/api/client"


var app = angular.module('myApp', ['ngRoute']);
app.controller('HomeController', function($scope, $http, $location, $routeParams) {
    $scope.videos = []
    $scope.init = function(){
            $scope.getVideos()
            if (($location.$$path).slice(0,4) == "/sub"){
                $scope.getVideoDetail($routeParams.id)
            }
    }

    
    $scope.getVideos = function(){
        $http({
            url: apiUrl + "/videos",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function(response){
            $scope.videos = response.data.data
        }).catch(function(e){

        })
    }
    $scope.getVideoDetail = function(id){
        $http({
            url: apiUrl + "/video/" + id,
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(function(response){
            $scope.video_detail = response.data.data
        }).catch(function(e){

        })
    }
    $scope.downFile = function(file_ass){
        $scope.video_download = {
            'file_ass': file_ass
        }
    }
    $scope.init()
});