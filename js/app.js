
// create our angular app and inject ngAnimate and ui-router 
// ============================================================================='angulartics', 'angulartics.google.analytics'
angular.module('formApp', ['ngAnimate', 'ABL.controllers', 'ui.router', 'ui.bootstrap', 'ngTouch', 'angularMoment','angulartics', 'angulartics.google.analytics'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: '/asset/templates/form.html',
            controller: 'formController',
        })

        .state('terms', {
            url: '/terms',
            templateUrl: '/asset/templates/terms.html',
            controller: 'TermsCtrl'
        })
        .state('age', {
            url: '/requirements',
            templateUrl: '/asset/templates/requirements.html',
            controller: 'AgeCtrl'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: '/asset/templates/home.html',
            controller: 'AlbumCtrl',
            resolve: {
                convertCurrencyResolve: function ($http){
                    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22CADUSD%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=";
                    return $http({ method: 'GET', url: query })
                        .then(function (data) {
                        return data;
                    });
                },
                activityResolve: function ($http, serverService) {
                    // $scope.serverHost = serverService.serverHost;
                    // $scope.serverPort = serverService.serverPort;
                    console.log("activityResolve "+"http://162.242.170.162/api/product?city=whistler "+serverService.serverAuth);
                    $scope.serverAuth = serverService.serverAuth;
                    
                    return $http({ method: 'GET', url: "http://162.242.170.162/api/product?city=whistler", headers: {'Authorization': $scope.serverAuth }})
                    .then(function(data) {
                        console.log("activityResolve success");
                        return data;//$scope.handleImagesLoaded(data);
                        //$scope.loading=true;
                    })
                    .error(function(data) {
                        console.log("activityResolve Fail", data);
                        //alert("Cannot Get Data");
                    });
                }
            }    
        })
        
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: '/asset/templates/more-info.html',
            controller: 'MainCtrl'
        })
        
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: '/asset/templates/buy-now.html',
            controller: 'PaymentCtrl'
        })

        .state('complete', {
            url: '/complete',
            templateUrl: '/asset/templates/form-payment.html',
            controller: 'CompleteCtrl'
        });
       
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/profile');
})

// our controller for the form
// =============================================================================
.controller('formController', function($scope) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
    
    // // function to process the form
    // $scope.processForm = function() {
    //     alert('Payment done!');  
    // };
    
});

