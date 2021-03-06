'use strict';
//dedddd

/*===========================================================================================
Создание заявки для одного слушателя
===========================================================================================*/

controllersModule.controller('OrderNewStudentCtrl', function($scope, $timeout, $filter, $routeParams, OrderSrvc, TrainingSrvc, RegionSrvc, CompanySrvc, UtilsSrvc){
    $scope.menu.hide = true;
    $scope.ordForm = {order:{mailingOn: true}};
    $scope.questionData = {};
    $scope.cities = [];
 
    /* Инициализация */
    $scope.ordForm.init = function(){
        $scope.ordForm.btnDisabled = false;
        $scope.ordForm.companies = [];
        $scope.ordForm.orderCaption = $filter('localize')("Форма регистрации слушателя");
        $scope.ordForm.trainingCaption = $filter('localize')("Подробнее о курсе");;
        $scope.ordForm.btnClearShow = true;
        $scope.ordForm.order.trainingId = $routeParams.training;
    };

    /* Подгрузить обучение */
    $scope.ordForm.loadTraining = function(){
        TrainingSrvc.getForUser($scope.ordForm.order.trainingId).then(
            function(data){
                $scope.ordForm.order.city = data.city;
                $scope.ordForm.training = data;    
                $scope.ordForm.training.dates = UtilsSrvc.getTwoDate(data.dateStart, data.dateFinish);
                $scope.ordForm.training.urlAddGoogleCalendarEvent = TrainingSrvc.getUrlForCreateGoogleCalendarEvent(
                                        data.course.name + '. '+ data.city.name,
                                        data.dateGoogleCalendar,
                                        data.city.name + ', ' + data.address.title,
                                        {
                                            trainingId: data.id,
                                            courseProgramUrl: 'http://' + data.course.programUrl,
                                            city: data.city.name + ', ' + data.city.parentName + ', ' + data.city.greatParentName,
                                            address: data.address.title + ', '+ data.room,
                                            time: data.timeStart + ' - ' + data.timeFinish,
                                            teacher: data.teacher.lastName + ' ' + data.teacher.firstName + ', ' + data.teacher.email,
                                            curator: data.curator.fullName + ', ' + data.curator.phone + ', ' + data.curator.email,
                                            otherInfo: data.otherInfo   
                                        });

                $scope.menu.brandCaption = $filter('localize')('Форма регистрации на обучение компании InterSystems по курсу "') + data.course.name + '" ';
                $scope.menu.appTitle = $scope.menu.brandCaption;
                 
                callbackYmap = function() {
                    var myMap = new ymaps.Map("map", {
                            center: [data.address.lat, data.address.lng],
                            zoom: 15,
                            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
                        });

                    var placemark = new ymaps.Placemark([data.address.lat, data.address.lng], {
                            balloonContent: data.city.name + '. ' + data.street + ', '+ data.room
                        }, {
                            preset: 'islands#nightDotIcon',
                            iconColor: '#0095b6'
                        });   
                        
                    myMap.geoObjects.add(placemark);
                };
                
                
                function loadScript(url){
                    var div = document.getElementById('divYmapScript');
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    
                    // Fire the loading
                    div.appendChild(script);
                };
                
                loadScript("http://api-maps.yandex.ru/2.1/?lang=" + StcAppSetting.lang + "&onload=callbackYmap");
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    
    /* Стереть все */
    $scope.ordForm.clear = function(){
        $scope.ordForm.order = {
            mailingOn: true,
            trainingId: $scope.ordForm.order.trainingId,
            city: $scope.ordForm.training.city
        };
        $scope.ordForm.btnDisabled = false;
    };

    $scope.ordForm.formatCity = function(){
        if ($scope.ordForm.order.mailingOn && !$scope.ordForm.order.city.id){
            $scope.ordForm.order.city = '';
        }
    };

    /* Создать заявку */
    $scope.ordForm.submit = function(){
        OrderSrvc.createOrderNewStudent($scope.ordForm.order).then(
            function(data){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Готово!', 'Ваша заявка принята к рассмотрению. На указанный Вами адрес электронной почты придет письмо-подтверждение.', 'info', true);
                $scope.ordForm.btnDisabled = true;
                $scope.ordForm.btnClearShow = true;
            },
            function(response){
                $scope.ordForm.alert = UtilsSrvc.getAlert('Внимание!', response.data.replace(/ОШИБКА #5001: /g, "").replace(/Error #5001: /g, ""), 'error', true);
            });
    };
    
    // Подгружать города по набору
    $scope.loadCities = function(startsWith){       
        if(!startsWith || startsWith.length == 0)
            $scope.cities = [];
        
        if (!startsWith || startsWith.length != 2)
            return;  

        RegionSrvc.getAllCitiesStartsWith(startsWith).then(
            function(data){
                $scope.cities = data;
            },
            function(response){
                $scope.alert = UtilsSrvc.getAlert('Ошибка !', response.data, 'error', true);
            }); 
    };

    //================================================================================
    // FEEDBACK
    //================================================================================  
    $scope.openQuestionDialog = function(){
        $scope.questionData = {};
        $('#MSGModal').modal('show');
        $scope.msgModalVisible = true;
    };
    
    $scope.closeQuestionDialog = function(){
        $scope.clearQuestionForm();
        $('#MSGModal').modal('hide');
        $scope.msgModalVisible = false;
    };
    
    $scope.createQuestion = function(){
        TrainingSrvc.createQuestion($scope.ordForm.training.id, $scope.questionData).then(
            function(data){
                $scope.clearQuestionForm();         
                $scope.questionAlertLabel = UtilsSrvc.getAlertLabel('Ваше сообщение принято.', 'success');
            },
            function(response){
                $scope.questionAlertLabel = UtilsSrvc.getAlertLabel('Ошибка - ' + response.data, 'warning');
            });
    };

    $scope.clearQuestionForm = function(){
        $scope.questionData = {};        
        $scope.form_feedback.$setPristine();
    };

    
    
    
    
    $scope.ordForm.init();
    $scope.ordForm.loadTraining();
  });

