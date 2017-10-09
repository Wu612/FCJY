angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

 
//我的课程数据

.factory("mycourseList",function(){
	
	 var courseList=[
//	     加/www/ 指服务www文件下的
	    {id:0,Cpic:"/www/img/ben.png",Cname:"java",Cdes:"好的",cprice:888},
					{id:1,Cpic:"/www/img/ben.png",Cname:"html",Cdes:"好的",cprice:666},
					{id:2,Cpic:"/www/img/ben.png",Cname:"css",Cdes:"好的",cprice:777},
					{id:3,Cpic:"/www/img/ben.png",Cname:"js",Cdes:"好的",cprice:999},
					{id:4,Cpic:"/www/img/ben.png",Cname:"html",Cdes:"好的",cprice:666},
					{id:5,Cpic:"/www/img/ben.png",Cname:"css",Cdes:"好的",cprice:777},
					{id:6,Cpic:"/www/img/ben.png",Cname:"js",Cdes:"好的",cprice:999}
	     ]
	 	
	 	 return {
	 	 	 
	 	 	 all:function(){
	 	 	 	 return courseList
	 	 	 },
	 	 	 
	 	 	 	//传id
	 	 	 	get:function(id){
	 	 	 		for(var i=0;i<courseList.length;i++){
	 	 	 			if(id==courseList[i].id){
	 	 	 				return courseList[i]
	 	 	 			}
	 	 	 		}
	 	 	 	},
	 	 	 	
	 	 	 	//				删除
	 	 	 	remove:function(item){
	 	 	 		return courseList.splice(courseList.indexOf(item),1)
	 	 	 	},
	 	 	 //				分页	
	 	 	 	page:function(page){
	 	 	 		
	 	 	 		return courseList.splice((page-1)*3,(page-1)*3+3);//成被加载了
	 	 	 	}
	 	 	
	 	 }
	 
	
})
//页面的存储数据
 
.factory('locals',function($window){
	
	 return {
	 	 set:function(key,value){
	 	 	
	 	 	 $window.localStorage[key]=value;
	 	 },
	 	 get:function(key,defaultValue){
	 	 	
	 	 	return $window.localStorage[key]||defaultValue;
	 	 }
	 }
})
//各个页面共享数据
.factory("shareData",function($window){
	
	  var allData={};
	  
	  return {
	  	set:function(key,value){
	  		allData[key]=value;
	  	},
	  	
	  	get:function(key,defaultValue){
	  		
	  		return allData[key]||defaultValue;
	  	}
	  }

})
