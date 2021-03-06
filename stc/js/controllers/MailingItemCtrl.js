'use strict';
//dddddfd

/*===========================================================================================
Элемент рассылки, создание и изменение
===========================================================================================*/

controllersModule.controller('MailingItemCtrl', function($scope, $routeParams, $location, MailingSrvc, UtilsSrvc){
    $scope.mitemForm = {};
    
    $scope.mitemForm.init = function(){
        $scope.mitemForm.loadGroups();

        if (!isNaN(parseInt($routeParams.iId))){
            $scope.mitemForm.caption = 'Редактирование участника';
            $scope.mitemForm.actionName = 'Сохранить';
            $scope.mitemForm.loadData();    
        }
        else{
            $scope.mitemForm.caption = 'Добавление участника';
            $scope.mitemForm.actionName = 'Добавить';
            $scope.mitemForm.mitem = {group: {id: parseInt($routeParams.gId)}};
        }
    };

    // Загрузить участника
    $scope.mitemForm.loadData = function(){
        MailingSrvc.getGroupItem($routeParams.iId).then(
            function(data){
                $scope.mitemForm.mitem = data;
            },
            function(response){
                 $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Сохранить / создать участника
    $scope.mitemForm.submit = function(){
        MailingSrvc.saveGroupItem($scope.mitemForm.mitem).then(
            function(data){
	            if (!$scope.mitemForm.mitem.id){
                	$scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Участник добавлен.', 'success', true);
                	$scope.mitemForm.course = {};
	            }
                else{
                	$scope.mitemForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                }
                
                $scope.form.$setPristine();
            },
            function(response){
                $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Отмена - возврат на страницу групп
    $scope.mitemForm.cancel = function(){
        $location.path('/mailing/groups');
    };

    // Загрузить группы рассылки для комбобокса
    $scope.mitemForm.loadGroups = function(){
        MailingSrvc.getGroups().then(
            function(data){
                $scope.mitemForm.groups = data;
            },
            function(response){
                $scope.mitemForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };
    
    $scope.mitemForm.init();
});
    

