'use strict';
//dddddddfd

/*===========================================================================================
Компания
===========================================================================================*/

controllersModule.controller('CompanyCtrl', function($scope, $routeParams, $window, $route, $timeout, $location, OrderSrvc, PersonSrvc, CompanySrvc, UtilsSrvc){
    if ($scope.menu.active) $scope.menu.active.css = "menuAfterActive";

    $scope.searchForm = {visible: true, persons: [], person:''};
    $scope.compForm = {form: {}, company: {}, contact: {}, visible: true};
    $scope.compForm.caption = "Создание организации";
   
    $scope.compForm.init = function(){
        if ($routeParams.id){
            $scope.compForm.caption = "Редактирование организации";
            $scope.compForm.loadCompany($routeParams.id);
        }
        else if ($routeParams.order){
            $scope.compForm.caption = "Создание организации из заявки";
            $scope.compForm.loadOrder($routeParams.order);
        }
        else if ($routeParams.ordernewstudent){
            $scope.compForm.caption = "Создание организации из заявки от слушателя";
            $scope.compForm.loadOrderNewStudent($routeParams.ordernewstudent);
        }
    };

    // Поиск персоны
    $scope.searchForm.search = function(startsWith){
        if(!startsWith || startsWith.length == 0){
            $scope.searchForm.persons = [];
            startsWith = '';
        }
        
        if (startsWith.length != 2)
            return;  
        
        PersonSrvc.getBySearchParameters(startsWith).then(
            function(data){
                $scope.searchForm.persons = data;
            },
            function(response){
                $scope.searchForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    
    // Загрузить новую заявку
    $scope.compForm.loadOrder = function(code){
        OrderSrvc.getOrder(code).then(
            function(data){
                $scope.compForm.company = {contact: {}};
                $scope.compForm.company.shortName = data.contact.company.shortName;
                $scope.compForm.company.site = data.contact.company.site;
           
                $scope.compForm.company.contact = data.contact;
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Загрузить заявку от слушателя
    $scope.compForm.loadOrderNewStudent = function(id){
        OrderSrvc.getOrderNewStudent(id).then(
            function(data){
                $scope.compForm.company = {contact: {}};
                $scope.compForm.company.shortName = data.company.shortName;
               
                $scope.compForm.company.contact = data;
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };

    // Сохранить
    $scope.compForm.save = function(){
        // Создать компанию из заявки вместе с контактом
        if ($routeParams.order){
            CompanySrvc.saveFromOrder($scope.compForm.company, $routeParams.order).then(
                function(data){
                    $window.history.back();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
        else if ($routeParams.ordernewstudent){
            CompanySrvc.saveFromOrderNewStudent($scope.compForm.company, $routeParams.ordernewstudent).then(
                function(data){
                    $window.history.back();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }
        else if ($routeParams.id){
            CompanySrvc.save($scope.compForm.company).then(
                function(data){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Готово!', 'Изменения сохранены.', 'success', true);
                    $scope.compForm_form.$setPristine();
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }
        else {
            console.log($scope.compForm.company);
            CompanySrvc.save($scope.compForm.company).then(
                function(data){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Готово!', 'Создание завершено.', 'success', true);
                    $location.path('/company/' + data.id);
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
        }       
    };
    
    // Загрузить компанию
    $scope.compForm.loadCompany = function(id){
        CompanySrvc.get(id).then(
                function(data){
                    data.status = data.status == 1; 
                    data.isUnknownCity = data.isUnknownCity == 1; 
                    $scope.compForm.company = data;
                },
                function(response){
                    $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                    
                });
    };


    $scope.compForm.addContact = function(){
        if (!$scope.compForm.company.id){
            UtilsSrvc.openMessageBox("Внимание!", "Сначала создайте организацию.");
            return;
        }
        
        $location.path('/company/' + $scope.compForm.company.id + '/person');
    };
    
    // Редактировать контакт - переход
    $scope.compForm.editContact = function(){
        $location.path('/person/' + $scope.compForm.company.contact.id);
    };

    // Сменить контакт - переход
    $scope.compForm.changeContact = function(){
        CompanySrvc.changeContact({contact: $scope.searchForm.person, companyId: $routeParams.id, isReplace: 1}).then(
            function(data){
                $route.reload();
            },
            function(response){
                $scope.compForm.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            }); 
    };
    
    $scope.compForm.init();
});

