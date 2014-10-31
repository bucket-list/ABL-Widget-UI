var app = angular.module('ABL.controllers', ['ngAnimate']);

app.service('productService', function ($window) {
    //var allProducts = getData();
    var currentProduct = {};
    var sessionCurrentProduct = {};
    var objectifiedProduct = {};
    var setData = function(dataFromView) {
        currentProduct = dataFromView;
        $window.sessionStorage["currentProductData"] = JSON.stringify(currentProduct);
        console.log("Data"+dataFromView);
    };
    var getCurrentProduct = function(){
        sessionCurrentProduct= $window.sessionStorage["currentProductData"];
        objectifiedProduct = JSON.parse(sessionCurrentProduct);
        return objectifiedProduct;
    };
    return {
        setData: setData,
        getCurrentProduct: getCurrentProduct
    };
});

app.factory("serverService", function() {
    return {
        //dev
        api_key: location.search.split("api_key=")[1],
        //serverHost: 'js.ablsolution.com',
        serverPort: '8081',
        // serverAuth: 'Basic dGVzdDphc2Rm',
        serverAuth: 'Basic YWdyaWdnczplcGljaG91c2U=',
        //production
        serverHost: '162.242.170.162',
        // serverPort: '8081'    
    };

});

app.factory('CustomerData', function () {

    var data = {
        customerInfo : ''
    };

    return {
        getCustomerData: function () {
            return data.customerInfo;
        },
        setCustomerData: function (customer) {
            data.customerInfo = customer;
        }
    };
});

app.controller('CompleteCtrl', function ($scope, CustomerData) {
    $scope.customer_info = CustomerData.getCustomerData();
    console.log($scope.customer_info);
    // $scope.currentImage = productService.getCurrentProduct();
    // $scope.api_key = serverService.api_key;
})
app.controller('TermsCtrl', function ($scope, productService, serverService) {
    $scope.currentImage = productService.getCurrentProduct();
    $scope.api_key = serverService.api_key;
})
app.controller('AgeCtrl', function ($scope, productService, serverService) {
    $scope.currentImage = productService.getCurrentProduct();
    $scope.api_key = serverService.api_key;
})
app.controller('PaymentCtrl', function ($scope, $http, $timeout, productService, $state, serverService, CustomerData) { 
    $scope.currentImage = productService.getCurrentProduct();
    $scope.api_key = serverService.api_key;
    $scope.formData = {};
    $scope.onlyNumbers = /^\d+$/;
    //total price is calculated here and accessed here
    // $scope.paymentPrice = function() {
    //         $scope.masterPrice = $scope.numberOf * $scope.currentImage.totalPrice;
    //         return $scope.masterPrice;
    // }
    // $scope.getApiKey = function() {
    //       var api_key = $document.getElementById('abl').src;
    //       console.log("test Doc "+ $scope.formData.api_key)
    //     };
    // $scope.getApiKey();
    $scope.today = function() {
        $scope.formData.date = new Date($scope.currentImage.startdate);
    };
    $scope.today();

  $scope.clear = function () {
    $scope.formData.date = null;
  };

  // // Disable weekend selection
  // $scope.disabled = function(date, mode) {
  //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  // };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date($scope.currentImage.startdate);
  };
  $scope.toggleMin();

  $scope.toggleMax = function() {
    // console.log( new Date($scope.currentImage.enddate).format("dd-mm-yy"));
    $scope.maxDate = $scope.maxDate ? null : new Date($scope.currentImage.enddate);
  };
  $scope.toggleMax();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    "show-weeks": false,
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.checkDate = function(dt) 
  {
    //console.log(dt, $scope.minDate);
    if($scope.dt < $scope.minDate){
        $scope.formData.date = $scope.minDate;
    }    //$scope.maxDate = $scope.maxDate ? null : new Date($scope.currentImage.enddate);
  };
        $scope.calculatePrice = function () {
            if($scope.currentImage.price!=0){
                $scope.adultSubtotal = $scope.numberOfAdults * $scope.currentImage.price;
                $scope.paymentSubtotal = $scope.adultSubtotal;
                $scope.paymentHosting = $scope.numberOfAdults * $scope.currentImage.host_fee_value;
                $scope.paymentTax = $scope.numberOfAdults * $scope.currentImage.tax_fee_value;
                $scope.paymentPrice = $scope.numberOfAdults * $scope.currentImage.totalPrice;
            }
             else {
                $scope.paymentSubtotal = 0;
                $scope.paymentHosting = 0;
                $scope.paymentTax = 0;
                $scope.paymentPrice = 0;
            }
            
            if($scope.currentImage.youthPrice!=0){
                $scope.youthSubtotal = $scope.numberOfYouth * $scope.currentImage.youthPrice;    
                $scope.paymentSubtotal += $scope.youthSubtotal;
                $scope.paymentHosting += $scope.numberOfYouth * $scope.currentImage.youth_host_fee_value;
                $scope.paymentTax += $scope.numberOfYouth * $scope.currentImage.youth_tax_fee_value;
                $scope.paymentPrice += $scope.numberOfYouth * $scope.currentImage.youthTotalPrice;
            } 
            else if($scope.currentImage.childPrice!=0){
                $scope.childSubtotal = $scope.numberOfChildren * $scope.currentImage.childPrice;    
                $scope.paymentSubtotal += $scope.childSubtotal;
                $scope.paymentHosting += $scope.numberOfChildren * $scope.currentImage.child_host_fee_value;
                $scope.paymentTax = $scope.numberOfChildren * $scope.currentImage.child_tax_fee_value;
                 $scope.paymentPrice += $scope.numberOfChildren * $scope.currentImage.childTotalPrice;
            }
            $scope.tax_and_fee = $scope.paymentTax + $scope.paymentHosting;
        }
    //this watches the ng-model input for changes and changes the payment price according to that and stores it
    $scope.$watch('numberOfAdults', function() {
        $scope.calculatePrice();
    });
    $scope.$watch('numberOfYouth', function() {
        $scope.calculatePrice();

    });
    $scope.$watch('numberOfChildren', function() {
        $scope.calculatePrice();

    });    
    $scope.$watch('timez', function() {
        $scope.boughtForDate = moment(new Date($scope.formData.date)).format('MM-DD-YYYY');
        console.log($scope.boughtForDate+" "+$scope.timez);//moment($scope.boughtForDate).format('MM-DD-YYYY hh:mmA'));.setTime($scope.timez)
    });
    $scope.geoip = {};
        $.getJSON("http://jsonip.com?callback=?", function (data) {
                $.getJSON("http://www.telize.com/geoip/"+data.ip, function (geodata) {
                     $scope.formData.geoip = geodata;
                });
            });
        $.getJSON("http://"+serverService.serverHost+"/api/clientID", function (data) {
            braintree.setup(data.token, "dropin", { container: "dropin"});
        });
                // , "<integration>", options
            // create a blank object to hold our form information
            // $scope will allow this to pass between controller and view
            // process the form
         $scope.processPaymentForm = function(expr) {
                var form = this;
                form.formData.product_id = $scope.currentImage._id;
                form.formData.subtotal = $scope.paymentSubtotal;
                form.formData.hosting_paid = $scope.paymentHosting;
                form.formData.tax_paid = $scope.paymentTax;
                form.formData.price_paid = $scope.paymentPrice;
                
                form.formData.number_of_adults = $scope.numberOfAdults;
                form.formData.number_of_youth = $scope.numberOfYouth;
                form.formData.number_of_children = $scope.numberOfChildren;
                // var dateTime = new Date(form.formData.date+form.formData.time);
                
                // console.log($scope.timez, $scope.newtime);
                form.formData.date_togo = form.formData.date; //new Date(form.formData.date+form.formData.time);
                form.formData.time_togo = $scope.timez;//new Date(form.formData.time);
                form.formData.api_key = location.search.split("api_key=")[1];
                //server host name and port!
                $scope.serverHost = serverService.serverHost;
                $scope.serverPort = serverService.serverPort;
                $scope.serverAuth = serverService.serverAuth;
    
                //console.log(form.formData);
                $http({
                    method  : 'POST',
                    url     : "http://"+$scope.serverHost+":"+$scope.serverPort+"/api/checkout",
                    data    : $.param(form.formData),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': $scope.serverAuth }  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data) {
                        if (!data.success) {
                            // if not successful, bind errors to error variables       
                            $scope.alerts = [];
                            var alert = {
                                msg: data.error
                            }
                            alert.close = function(){
                                $scope.alerts.splice($scope.alerts.indexOf(this), 1);
                            }
                            $scope.alerts.push(alert);
                            $timeout(function(){
                                $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                            }, 5000); // maybe '}, 3000, false);' to avoid calling apply
                            // $.getJSON("http://"+serverService.serverHost+"/api/clientID", function (data) {
                            //     braintree.setup(data.token, "dropin", { container: "dropin"});
                            // });
                            $scope.errorName = data.error;
                            //$scope.errorSuperhero = data.errors.superheroAlias;
                        } else {
                            //customerData = JSON.parse(data);
                            CustomerData.setCustomerData(data.customer_info.booking_ref);
                            // $scope.booking_ref = data.customer_info.booking_ref;
                            $state.go('complete');
                            // if successful, bind success message to message
                            // $scope.message = data.message;

                        }
                    }).error(function(data) {
                        console.log(data);
                    });
            };

    // define angular module/app
        //var formApp = app.controller('formCtl', []);
     //$('#date_time').datetimepicker();
});
// .directive('contenteditable', function() {
//     return {
//       restrict: 'A',
//       require: '?ngModel',
//       link: function(scope, element, attr, ngModel) {
//         var read;
//         if (!ngModel) {
//           return;
//         }
//         ngModel.$render = function() {
//           return element.html(ngModel.$viewValue);
//         };
//         element.bind('blur', function() {
//           if (ngModel.$viewValue !== $.trim(element.html())) {
//             return scope.$apply(read);
//           }
//         });
//         return read = function() {
//           //console.log("read()");
//           return ngModel.$setViewValue($.trim(element.html()));
//         };
//       }
//     };
//   });




// app.directive('datetimez', function() {
//     return {
//         restrict: 'A',
//         require : 'ngModel',
//         link: function(scope, element, attrs, ngModelCtrl) {
//           element.datetimepicker({
//            format: "MM-yyyy",
//            viewMode: "days", 
//             minViewMode: "months",
//               pickTime: false,
//           }).on('changeDate', function(e) {
//             ngModelCtrl.$setViewValue(e.date);
//             scope.$apply();
//           });
//         }
//     };
// });


app.controller('MainCtrl', function ($scope, productService, serverService) {
    $scope.currentImage = productService.getCurrentProduct();
    $scope.slides = $scope.currentImage.image_array;
    $scope.api_key = serverService.api_key;

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

    // app.animation('.slide-animation', function () {
    //     return {
    //         addClass: function (element, className, done) {
    //             if (className == 'ng-hide') {
    //                 TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
    //             }
    //             else {
    //                 done();
    //             }
    //         },
    //         removeClass: function (element, className, done) {
    //             if (className == 'ng-hide') {
    //                 element.removeClass('ng-hide');

    //                 TweenMax.set(element, { left: element.parent().width() });
    //                 TweenMax.to(element, 0.5, {left: 0, onComplete: done });
    //             }
    //             else {
    //                 done();
    //             }
    //         }
    //     };
    // });
app.controller('AlbumCtrl', function ($scope, $http, $timeout, $rootScope, productService, serverService) {
    $scope.url = 'images.json';
    $scope.images = [];
    $scope.imageCategories = [];
    $scope.currentImage = {};
    $scope.api_key = serverService.api_key;
    $scope.setData = function(data) {
        productService.setData(data);
    }

    $scope.initSlider = function () {
            $('.description').on('hover', function() {
                $(this).toggleClass('show-description');
                });
            };
          
          $scope.initSlider();


    $scope.handleImagesLoaded = function (data, status) {
        $scope.images = data;
        // Set the current image to the first image in images
        $scope.currentImage = _.first($scope.images);
        // Create a unique array based on the category property in the images objects
        $scope.imageCategories = _.uniq(_.pluck($scope.images, 'category'));
    }

    $scope.fetch = function () {
        $scope.serverHost = serverService.serverHost;
        $scope.serverPort = serverService.serverPort;
        $scope.serverAuth = serverService.serverAuth;
    //console.log(serverService.serverHost+" "+serverService.serverPort+" "+serverService.serverAuth+" "+$scope.serverHost+" "+$scope.serverPort+" "+$scope.serverAuth+" ");
        // $http.defaults.headers.get = { 'Basic' : 'YWdyaWdnczpGdWNreW91MjAxNA' };
        //$http.defaults.headers.common.Authorization = 'Basic YWdyaWdnczpGdWNreW91MjAxNA==';
        $http.get("http://"+$scope.serverHost+"/api/product?city=whistler", {headers: {'Authorization': $scope.serverAuth}}).success($scope.handleImagesLoaded);
    };

    $scope.setCurrentImage = function (image) {
        $scope.currentImage = image;
        productService.setData(image);
        _.$inject = ["$scope", "image"]
    };
    $scope.clickFunction = function() {
        $rootScope.$broadcast('Update', $scope.currentImage);
      };

    // Defer fetch for 1 second to give everything an opportunity layout
    $timeout($scope.fetch, 5);
}).filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  });

        
