var app = angular.module('ABL.controllers', ['ngAnimate']);

app.service('productService', function() {
    var currentProduct = {};
    var setData = function(dataFromView) {
        currentProduct = dataFromView;
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

app.controller('PaymentCtrl', function ($scope, productService) { 
    $scope.currentImage = productService.getCurrentProduct();
})

app.controller('MainCtrl', function ($scope, productService) {
    $scope.currentImage = productService.getCurrentProduct();
    $scope.slides = 
    [
          {image: '../img/img00.jpg', description: 'Image 00'},
            {image: '../img/img01.jpg', description: 'Image 01'},
            {image: '../img/img02.jpg', description: 'Image 02'},
            {image: '../img/img03.jpg', description: 'Image 03'},
            {image: '../img/img04.jpg', description: 'Image 04'}
        ];

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
        $http.get($scope.url).success($scope.handleImagesLoaded);
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
});

