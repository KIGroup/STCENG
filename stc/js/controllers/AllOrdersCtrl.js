'use strict';
//dddddddcdd
 
/*===========================================================================================
Все заявки
===========================================================================================*/

controllersModule.controller('AllOrdersCtrl', function($scope, $cookieStore, $location, $routeParams, $filter, OrderSrvc, UtilsSrvc, RegionSrvc, CourseTeacherSrvc, TrainingSrvc, CompanySrvc, PersonSrvc){
    $scope.menu.selectMenu('orders');
    if (!$scope.pageStore.orders)
        $scope.pageStore.orders = {grid:{}};

    $scope.order = {};
	if ($scope.menu.readOnlyMode){
		$scope.order.secondRowActionIcon = '';
	}
	else{
		$scope.order.secondRowActionIcon = 'icon-remove';
	}
	
   
    $scope.order.init = function(){
        $scope.order.columns = [
                          {name: 'Курс', sqlName: 'Course->Name->Value', isSorted: false, isSortable: true, isDown: true, isSearched: true,  isSearchable: true},
                          {name: 'Организация', sqlName: 'Company->ShortName->Value', isSorted: false, isSortable: true, isDown: true, isSearched: false, isSearchable: true},
                          {name: 'Слушатели', sqlName: 'StudentsNumber', isSorted: false, isSortable: false,isDown: true, isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '60px'}},
                          {name: 'Дата создания', sqlName: 'CreatedTS', isSorted: true, isSortable: true, isDown: false, isSearched: false, isSearchable: false, filter: 'date', captionStyle: {width: '190px'}},
                          {name: 'Статус', sqlName: 'OrderStatus', isSorted: false, isSortable: true, isDown: true,  isSearched: false, isSearchable: false, captionStyle: {textAlign: 'center', width: '70px'}}];
        
        $scope.order.properties = [{name:'course.name'}, 
                                   {name:'contact.company.shortName'},
                                   {name:'studentsNumberString', cellStyle: {textAlign: 'center'}, 
                                   	    calculate: function(item){
	                                   	   if (item.status.code == 'Closed'){
	                                   	    	item.studentsNumberString = '---';
	                                   	   }
	                                   	   else{
		                                   	   item.studentsNumberString = item.studentsNumber;
	                                   	   }
	                                    }}, 
                                   {name:'createdTS', filter: 'date', filterParam: $filter('localize')('d MMMM y, HH:mm:ss')}, 
                                   {name:'status.name', cellStyle: {textAlign: 'center'}, 
                                        getCssClass: function(item){
                                            var code = UtilsSrvc.getPropertyValue(item, 'status.code');
                                            
                                            var css = 'label';

                                            if (code == 'New')
                                                css += ' label-important';
                                            if (code == 'Approved')
                                                css += ' label-success';
                                            if (code == 'Closed')
                                                css += ' label-inverse';

                                            return css;
                                        }}];
        $scope.order.status = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.status', 'All');
        $scope.order.pageSize = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.grid.pageSize', 10);
        $scope.order.pageCurr = UtilsSrvc.getPropertyValue($scope.pageStore, 'orders.grid.pageCurr', 1);
        $scope.order.itemsTotal = 0;
        $scope.order.selectedItems = [];
        $scope.order.multiSelectMode = false;
        $scope.order.forciblyUpdate = 0;
        $scope.order.actionColumnVisible = true;
    };

    // order
    // Загрузка заявок
    $scope.order.loadItems = function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText){
        OrderSrvc.getAllOrdersForGrid(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, $scope.order.status).then(
            function(data){
                $scope.order.pageTotal = Math.ceil(data.itemsTotal / pageSize);
                $scope.order.itemsTotal = data.itemsTotal;
                $scope.order.items = data.items;

                if ($scope.order.selectedItems && $scope.order.items && $scope.order.selectedItems.length == 0 && $scope.order.items.length != 0){
                    $scope.order.selectedItems[0] = $scope.order.items[0];
                    $scope.order.selectedItems[0].rowClass = 'info';
                }

                $scope.order.contactType='order';
            },
            function(response){
                $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
            });
    };

    $scope.$watch('order.status', function(){
	    $scope.order.forciblyUpdate++;
        $scope.pageStore.orders.status = $scope.order.status;
    });
 
    $scope.$watch('order.selectedItems[0]', function(){
	    $scope.order.contactType = 'order';
    }, true);

	// Принять заявку
    $scope.order.accept = function(){
        function createCompany(){
            $location.path('/company/order/' + $scope.order.selectedItems[0].id);
        };

        if ($scope.order.selectedItems[0].contact.company.id){
            $scope.order.changeStatus($scope.order.selectedItems[0].id, 'approved');
        }
        else {
            UtilsSrvc.openMessageBox('Принять заявку', 'Организация, указанная в заявке, не существует. Создать ее?', createCompany);
        }
    };
	
	
	// Закрыть заявку
    $scope.order.close = function(){
        function closeOrder(){
            $scope.order.changeStatus($scope.order.selectedItems[0].id, 'closed');
        };

        UtilsSrvc.openMessageBox('Изменение статуса заявки', 'Закрыть заявку?', closeOrder);
    };
	
	// Изменить статус заявки
    $scope.order.changeStatus = function(id, status){
        OrderSrvc.changeOrderStatus(id, status).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Статус заявки изменен.', 'success', true);
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
    };
	
  
    // Удалить заявку
    $scope.order.deleteOrder = function(item){
        function deleteOrder(){
            OrderSrvc.deleteOrder(item.id).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Заявка удалена.', 'success', true);
                    $scope.order.selectedItems = [];
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });  
        };

        UtilsSrvc.openMessageBox('Удалить заявку', $filter('localize')("Удалить заявку от организации") + " '" + item.contact.company.shortName + "'?", deleteOrder);    
    };

    // Обновить или заменить контакт компании  
    $scope.order.changeCompanyContact = function(isReplace){
        var msgSuccess = 'Контакт заменен.';
        var msgWindow = ['Заменить контакт', 'Заменить контакт организации контактом из заявки? Старый контакт организации не будет удален.'];

        if (!isReplace){
            msgSuccess = 'Контакт обновлен.';
            msgWindow = ['Обновить контакт', 'Заменить данные контакта организации данными контакта из заявки?'];
        }
        
        function resolve(){
            CompanySrvc.changeContact({contact: $scope.order.selectedItems[0].contact, 
            								 companyId: $scope.order.selectedItems[0].contact.company.id, 
            								 isReplace: isReplace, 
            								 orderId: $scope.order.selectedItems[0].id}).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', msgSuccess, 'success', true);
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        };

        UtilsSrvc.openMessageBox(msgWindow[0], msgWindow[1], resolve);
    };

    $scope.order.openChangeCompanyDialog = function(){
        if (!$scope.order.companies || $scope.order.companies.length==0){
            CompanySrvc.getAll().then(
                function(data){
                    $scope.order.companies = data;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
        }
		
        $('#ChangeCompanyModal').modal('show');
        $scope.order.modalChangeCompanyVisible = true;
    };
    
   

    $scope.order.changeCompany = function(){
        $scope.order.modalChangeCompanyVisible = false;
        if (!$scope.order.newOrderCompany || !$scope.order.newOrderCompany.id){
            console.log($scope.order.newOrderCompany);
            return;
        }
        
        OrderSrvc.changeOrderCompany($scope.order.selectedItems[0].id, $scope.order.newOrderCompany.id).then(
                function(data){
                    $scope.order.alert = UtilsSrvc.getAlert('Готово!', 'Произошла смена организации в заявке.', 'success', true);
                    //$scope.order.selectedItems = [];
                    $scope.order.forciblyUpdate++;
                },
                function(response){
                    $scope.order.alert = UtilsSrvc.getAlert('Внимание!', response.data, 'error', true);
                });
    };

    $scope.order.init();
    
    if (!$scope.menu.admin){
	    $scope.menu.brandCaption = 'Система учёта курсов';
    	$scope.menu.appTitle = 'Система учёта курсов';
	    console.log('training $scope.menu.login();')
    	$scope.menu.login(); 
    };
  });

