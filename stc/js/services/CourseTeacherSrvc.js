'use strict';
//ddd

/*===========================================================================================
Курсы и преподватели
===========================================================================================*/

servicesModule.factory('CourseTeacherSrvc', function(DALSrvc) {
	return {
		/* Получить все курсы, коротко */
		getAll: function(isInUse){
			return DALSrvc.getPromise('get', StcAppSetting.user + '/json/course/isInUse/' + isInUse, null);
		},
		/* Получить все курсы, полная инфа, для таблицы */
		getAllForGrid: function(pageCurr, pageSize, sqlName, isDown, searchSqlName, searchText, isInUse){
			var first = pageSize * (pageCurr - 1) + 1;
            var obj = {sqlName: sqlName, 
                       isDown: isDown, 
                       first: first, 
                       last: first + pageSize - 1,
                       searchSqlName: searchSqlName, 
                       searchText: searchText,
                       isInUse: isInUse};

            return DALSrvc.getPromise('save', StcAppSetting.user + '/json/course/grid', obj);
		},
		/* Изменить статус курса */
		changeStatus: function(courseId){
			return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course/' + courseId + '/inverseStatus', null);
		},
		/* Обновить или создать курс */
		save: function(course){
			return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course', course);
		},
		/*  */
		get: function(id){
			return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/course/' + id, null);
		},
		getTeachers: function(id){
			return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/course/' + id + '/teacher', null);
		},
		/* Schedule */
		getSchedule: function(){
			return DALSrvc.getPromise('get', StcAppSetting.user + '/json/schedule', null);
		},
		addTeacher: function(courseId, person){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/course/' + courseId + '/teacher',  {teacher: person});
        },
        removeTeacher: function(courseId, teacherId){
            return DALSrvc.getPromise('delete', StcAppSetting.admin + '/json/course/' + courseId + '/teacher/' + teacherId,  null);
        }
	}
});
