
// create our angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ABL.controllers', 'ui.router', 'ui.bootstrap', 'angularMoment'])

// configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'templates/form.html',
            controller: 'formController'
        })

        .state('terms', {
            url: '/terms',
            templateUrl: 'templates/terms.html'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('form.profile', {
            url: '/profile',
            templateUrl: 'templates/home.html',
            controller: 'AlbumCtrl'
        })
        
        // url will be /form/interests
        .state('form.interests', {
            url: '/interests',
            templateUrl: 'templates/more-info.html',
            controller: 'MainCtrl'
        })
        
        // url will be /form/payment
        .state('form.payment', {
            url: '/payment',
            templateUrl: 'templates/buy-now.html',
            controller: 'PaymentCtrl'
        })

        .state('complete', {
            url: '/complete',
            templateUrl: 'templates/form-payment.html'
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

