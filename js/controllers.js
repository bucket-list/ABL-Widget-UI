var app = angular.module('ABL', ['ui.bootstrap']);

app.service('dataService', function($http) {
delete $http.defaults.headers.common['X-Requested-With'];
this.getData = function(callbackFunc) {
    $http({
        method: 'GET',
        url: 'https://www.example.com/api/v1/page',
        params: 'limit=10, sort_by=created:desc',
        headers: {'Authorization': 'Token token=xxxxYYYYZzzz'}
     }).success(function(data){
        // With the data succesfully returned, call our callback
        callbackFunc(data);
    }).error(function(){
        alert("error");
    });
 }
});

app.controller('AlbumCtrl', function($scope, $http, $timeout, dataService) {
    // $scope.url = 'images.json';
    $scope.images = [];
    $scope.imageCategories = [];
    $scope.currentImage = {};

    $scope.data = null;
    dataService.getData(function(dataResponse) {
        $scope.data = dataResponse;
    });

// THIS IS OUR GET REQUEST
  //   function getData() {
  //   $http({
  //     method: "get",
  //     datatype: "json", 
  //     url: "http://dev.ablsolution.com/api/v1/product/381c2e2243d3cfdac8e05987dde1bfbf415ae6654c1308ce42278568ffd950f0/?s=BC",
  //     params: { action: "get" }
  //   }).success(function(data, status, headers, config) {
  //     console.log("GET successful!");
  //     $scope.appData = angular.fromJson(data).items;
  //   }).error(function(data, status, headers, config) {
  //     alert("GET failed!");
  //   });
  // };

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

    // Defer fetch for 1 second to give everything an opportunity layout
    $timeout($scope.fetch, 1000);
})

  var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
// var ModalDemoCtrl = function ($scope, $modal, $log) {

//   //$scope.items = ['item1', 'item2', 'item3'];

//   $scope.open = function (size) {

//     var modalInstance = $modal.open({
//       templateUrl: 'myModalContent.html',
//       controller: ModalInstanceCtrl,
//       size: size,
//       resolve: {
//         currentImage: function () {
//           return $scope.images;
//         }
//       }
//     });

//     modalInstance.result.then(function (selectedItem) {
//       $scope.selected = selectedItem;
//     }, function () {
//       $log.info('Modal dismissed at: ' + new Date());
//     });
//   };
// };

// // Please note that $modalInstance represents a modal window (instance) dependency.
// // It is not the same as the $modal service used above.

// var ModalInstanceCtrl = function ($scope, $modalInstance, images) {

//   $scope.images = images;
//   // $scope.selected = {
//   //   item: $scope.items[0]
//   // };

//   $scope.ok = function () {
//     $modalInstance.close($scope.selected.images);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// };

// app.controller('ModalDemoCtrl', function ($scope, $modal, $log) {
//     $scope.items = ['item1', 'item2', 'item3'];

//   $scope.open = function (size) {

//     var modalInstance = $modal.open({
//       templateUrl: 'myModalContent.html',
//       controller: ModalInstanceCtrl,
//       size: size,
//       resolve: {
//         items: function () {
//           return $scope.items;
//         }
//       }
//     });

//     modalInstance.result.then(function (selectedItem) {
//       $scope.selected = selectedItem;
//     }, function () {
//       $log.info('Modal dismissed at: ' + new Date());
//     });
//   };
  
// })

// app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

//     $scope.items = items;
//   $scope.selected = {
//     item: $scope.items[0]
//   };

//   $scope.ok = function () {
//     $modalInstance.close($scope.selected.item);
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };

// })