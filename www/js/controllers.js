angular.module('app.controllers', [])


.controller('loginCtrl', function($scope, $state) {

	$scope.clickLogin = clickLogin;


	function clickLogin(username, passwrod) {
		
		Parse.User.logIn(username, passwrod, {
			success: function(user) {
				$state.go('menu.recipic');
			},
			error: function(user, error) {
			    alert('Username or Password was wrong.');
			}
		});
	}
})

.controller('createRecipeCtrl', function($scope, $state, Camera) {

	$scope.takePicture = takePicture;
	$scope.save = save;


	function takePicture() {
		Camera.getPicture({
			quality: 75,
			targetWidth: 800,
			targetHeight: 300,
			saveToPhotoAlbum: false,
      		destinationType: 0, //Camera.DestinationType.DATA_URL,

      	}).then(function(imageData) {

      		$scope.imageData = "data:image/jpeg;base64," + imageData;

      	}, function(err) {
      		console.error(err);
      	});
    }

	function save(title, content) {
		
		var recipe = new Parse.Object("Recipe");
		recipe.set("title", title);
		recipe.set("content", content);
		recipe.set("user", Parse.User.current());

		var file = new Parse.File(
			'receipe-'+recipe.get('objectId')+'.jpg',
			{ base64: $scope.imageData });

		recipe.set('image', file);

		if (!title || !content) {
			return;
		}

		recipe.save().then(function(savedModel) {
	    	$state.go('menu.recipic');

	    }).fail(function(err) {
	    	alert(err);
	    });
	}

})


.controller('recipicCtrl', function($scope) {

	var ITEMS_PER_PAGE = 3;
	var offset = 0;
	var moreData = true;

	$scope.recipes = [];
	$scope.loadMore = loadMore;
	$scope.refresh = refresh;
	$scope.hasMoreData = hasMoreData;

	$scope.$on('$stateChangeSuccess', function() {
		refresh();
	});


	function loadMore() {

		if (!moreData) return;

		var query = new Parse.Query('Recipe');
		query.include('user');
		query.descending('createdAt');
	    query.limit(ITEMS_PER_PAGE);
	    query.skip(offset);
	    offset += ITEMS_PER_PAGE;
	    
		query.find().then(function(results) {
	    	if (results.length > 0){
			  	for (var i = 0; i < results.length; i++) {
			    	var object = results[i];
			    	var image = object.get('image');
			    	$scope.recipes.push({
				  		title: object.get('title'),
				  		content: object.get('content'),
				  		image: (image ? image.url() : ''),
				  		time: object.get('createdAt'),
				  		username: object.get('user').get('username'),
				  	});
			    }
		  	}else{
		  		moreData = false;
		  	}

	    }).fail(function(error) {
	    	alert("Error: " + error.code + " " + error.message);
	    }).always(function(){
	    	$scope.$broadcast('scroll.refreshComplete');
		    $scope.$broadcast('scroll.infiniteScrollComplete');
	    });
	}

	function refresh() {
		$scope.recipes = [];
		offset = 0;
		moreData = true;
		loadMore();
	}

	function hasMoreData() {
		return moreData;
	}

})
   

   
.controller('signupCtrl', function($scope) {

})
   
.controller('recipeCtrl', function($scope) {

})
 