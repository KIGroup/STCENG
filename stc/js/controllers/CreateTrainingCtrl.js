'use strict';
//ddd

/*===========================================================================================
Создание обучения без подгрупп
===========================================================================================*/

controllersModule.controller('CreateTrainingCtrl', function($scope, $routeParams, $location, UtilsSrvc, TrainingSrvc){
    $scope.training = {data:{timeStart:'9:00', timeFinish: '12:00', orders: []}};
    
    // Загрузить обучение по ИД и обновить/склонировать поля
    $scope.training.loadData = function(id){
        TrainingSrvc.get(id).then(
            function(data){
                $scope.training.data.isLoaded = true;
                $scope.training.data.teacher = data.teacher;
                $scope.training.data.course = data.course;
                $scope.training.data.city = data.city;
                $scope.training.data.room = data.room;
                $scope.training.data.address = data.address;
                $scope.training.data.street = data.street;
                $scope.training.data.curator = data.curator;
                $scope.training.data.timeStart = data.timeStart;
                $scope.training.data.timeFinish = data.timeFinish;
                $scope.training.data.timeStartType = data.timeStartType;
                $scope.training.data.timeFinishType = data.timeFinishType;
                $scope.training.data.isPublic = data.isPublic == 1;
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.training.submit = function(){
        TrainingSrvc.save($scope.training.data).then(
            function(data){
                 $location.path('/training/' + data.id);
            },
            function(response){
                $scope.training.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    
    if ($routeParams.id){
        $scope.training.loadData($routeParams.id);
    }
});

