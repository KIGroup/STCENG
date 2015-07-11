'use strict';
//d

/*===========================================================================================
===========================================================================================*/

controllersModule.controller('ScheduleFrameCtrl', function($scope, $window, $filter, CourseTeacherSrvc, TrainingSrvc, YandexSrvc, UtilsSrvc){
    console.log('ScheduleFrameCtrl loading')
    
    if ($scope.menu) {
	    $scope.menu.hideNavBar = true;
    	$("#divContainer").css("padding", "0");
    	$("body").css("padding", "0");
    } 
    $scope.page = {};
    $scope.page.courses = [];

    $scope.page.loadSchedule = function(){
        CourseTeacherSrvc.getSchedule().then(
            function(data){
                $scope.page.courses = data.courses; 
                
                if (data.courses.length != 0){
					data.courses[0].style = {borderTop: 'none'};
					
					if (data.courses[0].trainings.length != 0){
						data.courses[0].trainings[0].detailsVisible = true;
						data.courses[0].trainings[0].headStyle = {color : 'rgb(175, 5, 5)'}; 
					}
				}

                var host_appName = window.location.host + StcAppSetting.defaultApp;

                for(var i=0; i < $scope.page.courses.length; i++){
                    var course = $scope.page.courses[i];
                    course.programUrl = 'http://' + course.programUrl; 
                    course.urlCreateOrder = 'http://' + host_appName + '/stc/index.csp#/createorder?course=' + course.id;

                    for (var t=0 ; t < course.trainings.length; t++){
                        var training = course.trainings[t];

                        training.yandexMapUrl = YandexSrvc.getMapLink(training.address.lat, training.address.lng);
					
                        training.dates = UtilsSrvc.getTwoDate(training.dateStart, training.dateFinish);

                        training.address = training.street;
                        if (training.room != "" && training.room != "-"){
                            training.address += ', ауд. ' + training.room;
                        }

                        training.curatorInfo = training.curator.fullName;
                        if (training.curator.phone != ""){
                            training.curatorInfo += ', ' + training.curator.phone;
                        }

                        //if (training.curator.email != ""){
                        //    training.curatorInfo += ', ' + training.curator.email;
                        //}
    
                        training.urlJoin = 'http://' + host_appName + '/stc/index.csp#/training/' + training.id + '/order';
                        training.urlAddGoogleCalendarEvent = TrainingSrvc.getUrlForCreateGoogleCalendarEvent(
                                        course.name + '. '+ training.city.name,
                                        training.dateGoogleCalendar,
                                        training.city.name + ', ' + training.street,
                                        {
	                                        trainingId: training.id,
                                            courseProgramUrl: course.programUrl,
                                            city: training.city.name + ', ' + training.city.parentName + ', ' + training.city.greatParentName,
                                            address: training.address,
                                            time: training.timeStart + ' - ' + training.timeFinish,
                                            teacher: training.teacher.lastName + ' ' + training.teacher.firstName +  ', ' + training.teacher.email,
                                            curator: training.curatorInfo,
                                            otherInfo: training.otherInfo   
                                        });
                    }
                } 
                
            },
            function(response){
                console.log(response);
            });
    };

  	$scope.page.getStyle = function(idx){
		if (idx == 0) return {borderTop: 'none'};
		
		return {};
	};
    
    $scope.page.loadSchedule();

});
    

