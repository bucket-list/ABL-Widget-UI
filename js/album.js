var app = angular.module('ABL.controllers', ['ngAnimate','ui.bootstrap.datetimepicker']);

app.service('productService', function ($window) {
    //var allProducts = getData();
    var currentProduct = {};
    var setData = function(dataFromView) {
        currentProduct = dataFromView;
        $window.sessionStorage["currentProductData"] = dataFromView;
    };
    var getCurrentProduct = function(){
        return currentProduct;
    };
    return {
        setData: setData,
        getCurrentProduct: getCurrentProduct
    };
});

// app.controller('SecondCtrl', ['$scope','$rootScope',
//     function($scope,$rootScope) {

//       $rootScope.$on("Update", function(event, image) {
//         $scope.currentImage = image;
//       });
//     }
//   ])
// app.config(['$http', function($httpProvider) {
//         $httpProvider.defaults.useXDomain = true;
//         delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     }
// ]);

app.controller('PaymentCtrl', function ($scope, $http, productService) { 
    $scope.currentImage = productService.getCurrentProduct();
    $scope.geoip = {};
                // $http.get("http://www.telize.com/ip/", {headers: {"Access-Control-Allow-Origin:":"http://localhost:8080/"}}, function (error, response, body) {
                //   if (!error && response.statusCode == 200) {
                //     $scope.ip = body;
                //     console.log($scope.geoip); // Print the google web page.
                //   }
                //   else {
                //     console.log(error);
                //   }
                // });
    

                // $http.get("http://www.telize.com/geoip/"+$scope.ip, function (error, response, body) {
                //   if (!error && response.statusCode == 200) {
                //     $scope.geoip = body;
                //     console.log(geoip); // Print the google web page.
                //   }
                //   else {
                //     console.log(error);
                //   }
                // });
            // create a blank object to hold our form information
            // $scope will allow this to pass between controller and view
           $scope.formData = {};

            // process the form
             $scope.processPaymentForm = function() {
                var form = this;
                //console.log("Fuck "+$scope.formData);
               //$scope.message = formdata;
               //alert("Form Data: "+form.formData.fullName);
            $.getJSON("http://jsonip.com?callback=?", function (data) {
                $.getJSON("http://www.telize.com/geoip/"+data.ip, function (geodata) {
                     form.formData.geoip = geodata;
                });
                });

                $http({
                    method  : 'POST',
                    url     : 'http://162.242.170.162:8081/api/checkout',
                    data    : $.param(form.formData),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic YWdyaWdnczpGdWNreW91MjAxNA==' }  // set the headers so angular passing info as form data (not request payload)
                })
                    .success(function(data) {
                        console.log(data);

                        if (!data.success) {
                            // if not successful, bind errors to error variables
                            $scope.errorName = data.errors;
                            //$scope.errorSuperhero = data.errors.superheroAlias;
                        } else {
                            // if successful, bind success message to message
                            $scope.message = data.message;
                        }
                    }).error(function(data) {
                        console.log(data);
                    });
            };
    // define angular module/app
        //var formApp = app.controller('formCtl', []);
     //$('#date_time').datetimepicker();
});
// PaymentCtrl.$inject = ['$scope'];
     // create angular controller and pass in $scope and $http
        // function payFormCtl($scope, $http) {

        //     // create a blank object to hold our form information
        //     // $scope will allow this to pass between controller and view
        //     $scope.formData = {};

        //     // process the form
        //     $scope.processPaymentForm = function() {
        //         $http({
        //             method  : 'POST',
        //             url     : 'http://localhost:8081/api/checkout',
        //             data    : $.param($scope.formData),  // pass in data as strings
        //             headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        //         })
        //             .success(function(data) {
        //                 console.log(data);

        //                 if (!data.success) {
        //                     // if not successful, bind errors to error variables
        //                     $scope.errorName = data.errors.name;
        //                     $scope.errorSuperhero = data.errors.superheroAlias;
        //                 } else {
        //                     // if successful, bind success message to message
        //                     $scope.message = data.message;
        //                 }
        //             });

        //     };

        // }
app.directive('datetimemenu', function(element){
    
    return {
        restrict: 'EAC',
        template: '<div class="input-group date" id="date_time"><input type="text" class="form-control" placeholder=""/><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span></div>'
    };
    element.datetimepicker();
});

app.controller('MainCtrl', function ($scope, productService) {
    $scope.currentImage = productService.getCurrentProduct();
    $scope.slides = $scope.currentImage.image_array;
        // [
        //   {image: '../img/img00.jpg', description: 'Image 00'},
        //     {image: '../img/img01.jpg', description: 'Image 01'},
        //     {image: '../img/img02.jpg', description: 'Image 02'},
        //     {image: '../img/img03.jpg', description: 'Image 03'},
        //     {image: '../img/img04.jpg', description: 'Image 04'}
        // ];

        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
});

    app.animation('.slide-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    TweenMax.set(element, { left: element.parent().width() });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });

app.controller('AlbumCtrl', function ($scope, $http, $timeout, $rootScope, productService) {
    $scope.url = 'images.json';
    $scope.images = [];
    $scope.imageCategories = [];
    $scope.currentImage = {};

    $scope.setData = function(data) {
        productService.setData(data);
    }

    $scope.initSlider = function () {
            $('.description').on('hover', function() {
                $(this).toggleClass('show-description');
                });
        
                
        
            };
          
          $scope.initSlider();

  //   function getData() {
  //   $http({
  //     method: "get",
  //     datatype: "json", 
  //     url: "http://localhost:8081/api/product", 
  //     headers: { 'Authorization': 'Basic YWdyaWdnczpGdWNreW91MjAxNA=='}
  //   }).success($scope.handleImagesLoaded
  //   // function(data, status, headers, config) {
  //   //   console.log("GET successful!"+" Data: "+data);
  //   //   $scope.appData = data; //angular.fromJson(data).items;
  //   //   $scope.currentProduct = _.first($scope.appData);
  //   // }
  //   ).error(function(data, status, headers, config) {
  //     alert("WTF GET failed! "+data+" "+ status+" "+headers);
  //   });
  // };


// THIS IS OUR GET REQUEST
// getData();
//     function getData() {
//     $http({
//       method: "get",
//       datatype: "json", 
//       url: "http://dev.ablsolution.com/api/v1/product/381c2e2243d3cfdac8e05987dde1bfbf415ae6654c1308ce42278568ffd950f0/?s=BC",
//       params: { action: "get" }
//     }).success(function(data, status, headers, config) {
//       console.log("GET successful!");
//       $scope.appData = angular.fromJson(data).items;
//     }).error(function(data, status, headers, config) {
//       alert("GET failed!");
//     });
//   };

    $scope.handleImagesLoaded = function (data, status) {
        $scope.images = data;
        // Set the current image to the first image in images
        $scope.currentImage = _.first($scope.images);
        // Create a unique array based on the category property in the images objects
        $scope.imageCategories = _.uniq(_.pluck($scope.images, 'category'));
    }

    $scope.fetch = function () {
        $http.defaults.headers.get = { 'Basic' : 'YWdyaWdnczpGdWNreW91MjAxNA' };
        //$http.defaults.headers.common.Authorization = 'Basic YWdyaWdnczpGdWNreW91MjAxNA==';
        $http.get("http://162.242.170.162:8081/api/product?city=Whistler", {headers: {'Authorization': 'Basic YWdyaWdnczpGdWNreW91MjAxNA=='}}).success($scope.handleImagesLoaded);
    };

    $scope.setCurrentImage = function (image) {
        $scope.currentImage = image;
        _.$inject = ["$scope", "image"]
    };
    $scope.clickFunction = function() {
        $rootScope.$broadcast('Update', $scope.currentImage);
      };

    // Defer fetch for 1 second to give everything an opportunity layout
    $timeout($scope.fetch, 1000);
}).filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });

        
