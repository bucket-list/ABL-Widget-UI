var app = angular.module('ABL.controllers', ['ngAnimate']);
// var braintree = require('braintree');

app.service('productService', function ($window) {
    //var allProducts = getData();
    var currentProduct = {};
    var sessionCurrentProduct = {};
    var objectifiedProduct = {};
    var setData = function(dataFromView) {
        currentProduct = dataFromView;
        $window.sessionStorage["currentProductData"] = JSON.stringify(currentProduct);
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
// myApp.provider("convertCurrency", function(){
//    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22CADUSD%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=";
// $.getJSON(query, function (data) {
//     this.rate = data.query.results.rate.Rate;
// });

//     this.$get = function() {
//         var rate = this.rate;
//         return {
//             currentRate: function() {
//                 return "Rate: " + rate + "!"
//             }
//         }
//     };

//     this.setRate = function(name) {
        
//     };
// });


function getCurrentRate(callback){
    var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22CADUSD%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=";
        var rate = $.getJSON(query, function (data) {
            callback(data.query.results.rate.Rate);
        });
        //return rate;
};
app.factory("currencyRate", function(){
    var currency = { rate: 0 }
    // var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22"+currency.convertFrom+currency.convertTo+"CADUSD%22)&format=json&env=store://datatables.org/alltableswithkeys&callback=";
    // $.getJSON(query, function (data) {
    //  return currency = {
    //     rate : data.query.results.rate.Rate,
    //     convertFrom: 'CAD',
    //     convertTo: 'USD'
    //    }
    // console.log(currency.rate);
    // });
    
    return {
        getCurrencyRate: function() {
            return currency.rate;
        },
        setCurrencyRate: function(rate) {
            currency.rate = rate;
        }
    };
});

app.factory("serverService", function() {
    return {
        //dev
        api_key: location.search.split("api_key=")[1],
        serverHost: 'https://js.ablsolution.com',
        serverPort: '8081',
        // serverAuth: 'Basic dGVzdDphc2Rm',
        serverAuth: 'Basic YWdyaWdnczplcGljaG91c2U=',
        //production
        //serverHost: 'http://162.242.170.162',
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
app.factory('NonceData', function () {

    var data = {
        nonce : ''
    };

    return {
        getNonce: function () {
            return data.nonce;
        },
        setNonce: function (nonce) {
            data.nonce = nonce;
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
app.controller('PaymentCtrl', function ($scope, $http, $timeout, productService, $state, serverService, CustomerData, NonceData, currencyRate) { 
    $scope.currentImage = productService.getCurrentProduct();

    $scope.rate = currencyRate.getCurrencyRate();    
    //$scope.currentImage.price = +($scope.currentImage.price * $scope.rate).toFixed(2);
    
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
    });
    $scope.geoip = {};
        $.getJSON("https://freegeoip.net/json/", function (data) {
                $.getJSON("https://freegeoip.net/json/"+data.ip, function (geodata) {
                     $scope.formData.geoip = geodata;
                });
            });
        // $.getJSON("http://"+serverService.serverHost+"/api/clientID", function (data) {
        //     console.log(data.token);
        //     braintree.setup(data.token, "dropin", { container: "dropin"});
        // });
        //$scope.token = '';
        // console.log("Token should be blank /" + $scope.token + " /");
        $scope.nonce = '';
        //var nonce_to_pass = '';
        function setupBrainTree(callback){
            $.ajax({
              type: "GET",
              url: serverService.serverHost+"/api/clientID",
              headers: { "cache-control": "no-cache" },
              success: function (data) {
                // console.log("payment nonce");
                // console.log(data.token);
                // console.log("Token should be blank /" + $scope.token + " /");
                braintree.setup(data.token, "dropin", { container: "dropin",
                paymentMethodNonceReceived: function (event, nonce) {
                    // $scope.nonce = nonce;
                    //callback(nonce);
                    //$scope.nonce = NonceData.getNonce();
                    $scope.processPaymentForm(nonce);
                    //callback($scope.nonce);
                    // console.log("Inside: "+NonceData.getNonce());
                    }
                });
                //$scope.token = data.token;
              },
              // dataType: "json",
              cache: false,
              async: false
            });
        };
        setupBrainTree();
         //resultNonce = nonce;
        //     $scope.nonce = nonce;
       
                // , "<integration>", options
            // create a blank object to hold our form information
            // $scope will allow this to pass between controller and view
            // process the form

         $scope.processPaymentForm = function(nonce, expr) {
                var form = this;
               
                ///$scope.$('div#dropin').dispatchEvent(new Event('submit'));
                // (function(){
                console.log("nonce to pass "+ NonceData.getNonce()+" "+ $scope.nonce);
                //     alert("FUCK YOU!");
                //   }); //.dispatchEvent(new Event('submit'));//tigger('submit');
                //$("#dropin")
                // if(NonceData.getNonce()!=='') {
                // $timeout(function(), 250);

                $scope.selTime = $scope.timez[0];
                form.formData.product_id = $scope.currentImage._id;
                form.formData.subtotal = ($scope.paymentSubtotal * $scope.rate).toFixed(2);
                form.formData.hosting_paid = ($scope.paymentHosting * $scope.rate).toFixed(2);
                form.formData.tax_paid = ($scope.paymentTax * $scope.rate).toFixed(2);
                form.formData.price_paid = ($scope.paymentPrice * $scope.rate).toFixed(2);
                //form.formData.nonce = $scope.token;

                form.formData.number_of_adults = $scope.numberOfAdults;
                form.formData.number_of_youth = $scope.numberOfYouth;
                form.formData.number_of_children = $scope.numberOfChildren;
                // var dateTime = new Date(form.formData.date+form.formData.time);
                form.formData.payment_method_nonce =  nonce;//NonceData.getNonce();
                // console.log(form.formData);
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
                    url     : $scope.serverHost+"/api/checkout",
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
                    });

            };
        $scope.processPayment = function() {
            document.getElementById('checkout').dispatchEvent(new Event('submit'));
        };
});

app.controller('MainCtrl', function ($scope, $location, $analytics, productService, serverService, currencyRate) {
    // init();
    // function init(){
    // var exchangeRate;
    //    $scope.rate = getCurrentRate(function(rate){
    //         console.log(rate);
    //         return parseFloat(rate);
    //     });
    //     console.log("Current Rate "+$scope.rate);
    // }
    // // convertCurrency.getCurrencyRate().success(function(data){
        
    //     console.log("Current Rate "+$scope.rate);

    // });
    
    $scope.currentImage = productService.getCurrentProduct();
    $scope.rate = currencyRate.getCurrencyRate();    
    // $scope.currentImage.price = +($scope.currentImage.price * $scope.rate).toFixed(2);
    $scope.slides = $scope.currentImage.image_array;
    $scope.api_key = serverService.api_key;
    $analytics.pageTrack('/form/main_pg');
        $scope.nextState = function () {
            $location.path('/form/payment');
        }
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.nextSlide = function () {
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.prevSlide = function () {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
});

app.controller('AlbumCtrl', function ($scope, $http, $timeout, $rootScope, productService, serverService, currencyRate, $location, $anchorScroll, convertCurrencyResolve) {
    // console.log(convertCurrencyResolve);
    $scope.rate = parseFloat(convertCurrencyResolve.data.query.results.rate.Rate);
    currencyRate.setCurrencyRate($scope.rate);   

    // console.log("convertCurrencyResolve "+ $scope.rate);
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
        
    // $scope.nextSlide = function(index) {
    //     var newindex = index + 1
    //     var newHash = 'anchor' + newindex;
    //     if ($location.hash() !== newHash) {
    //         $location.hash('anchor' + newindex);
    //     } else {
    //         $anchorScroll();
    //     }

    // };

    $scope.nextSlide = function () {
        $(".rightArrow").click(function () { 
            var leftPos = $('#thumbWrapper').scrollLeft();
                $("#thumbWrapper").animate({scrollLeft: leftPos + 623}, 500);
        });
    };

    $scope.prevSlide = function () {
        $(".leftArrow").click(function () { 
        var leftPos = $('#thumbWrapper').scrollLeft();
        $("#thumbWrapper").animate({scrollLeft: leftPos - 623}, 500);
        });
    };



    $scope.handleImagesLoaded = function (data, status) {
        $scope.images = data;
        // $scope.setData = function(data) {
        //     productService.setData(_.first(data));
        // }
        $scope.setData(_.first($scope.images));
        // productService.setData(_.first($scope.images));
        // Set the current image to the first image in images
        if(productService.getCurrentProduct() === null) {
            $scope.currentImage = _.first($scope.images);
        }
        else {
            $scope.currentImage = productService.getCurrentProduct();
        }
        // $scope.currentImage.price = +($scope.currentImage.price * $scope.rate).toFixed(2);
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
        $http.get($scope.serverHost+"/api/product?city=whistler", {headers: {'Authorization': $scope.serverAuth}}).success($scope.handleImagesLoaded);
    };

    $scope.setCurrentImage = function (image) {
        $scope.currentImage = image;
        productService.setData(image);
        _.$inject = ["$scope", "image"]
    };

    $scope.nextState = function () {
        $location.path('/form/interests');
    }
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

        
