'use strict';
//dвdddвd

/*===========================================================================================
Заявки
===========================================================================================*/

servicesModule.factory('OrderSrvc', function(DALSrvc) {
	return {
	      /* Создание грязной заявки */
        createOrder: function(order){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/order', order);
        },
        /* Создание заявки для слушателя*/
        createOrderNewStudent: function(order){
            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/orderNewStudent', order);
        },
        /* Удаление любой заявки */
        deleteOrder: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/order/' + id, null);
        },
        /* Удаление заявки от слушателя*/
        deleteOrderNewStudent: function(id){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/orderNewStudent/' + id, null);
        },
        /* Получить все заявки */
        getAllOrdersForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, status){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       status: status};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/grid', obj);
        },
        /* Получить все заявки-студентов */
        getAllOrdersNewStudentForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, trainingId){
            var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       trainingId: trainingId};

            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/orderNewStudent/grid', obj);
        },
        /* Получить 1 заявку */
        getOrder: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/order/' + id, null);
        },
        /* Получить 1 заявку от слушателя*/
        getOrderNewStudent: function(id){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/orderNewStudent/' + id, null);
        },
        /* Сменить компанию в заявке */
        changeOrderCompany: function(orderId, companyId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/' + orderId + '/company/' + companyId, null);
        },
        /* Сменить компанию в заявке от слушателя */
        changeOrderNewStudentCompany: function(orderId, companyId){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/orderNewStudent/' + orderId + '/company/' + companyId, null);
        },
        /* Изменить статус заявки */
        changeOrderStatus: function(ordId, status){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/order/' + ordId + '/status/' + status, null);
        }
    }
});
