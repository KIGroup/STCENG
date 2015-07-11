'use strict';
//dddвd

/*===========================================================================================
Settings service for google, mail
===========================================================================================*/

servicesModule.factory('SettingsSrvc', function(DALSrvc) {
	return {
	    getGoogle: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/google/' + type, null);
        },
        getMail: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/mail/' + type, null);
        },
        getMailPreview: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/mail/preview/' + type, null);
        },
        getGooglePreview: function(type){
            return DALSrvc.getPromise('get', StcAppSetting.admin + '/json/settings/google/preview/' + type, null);
        },
        saveGoogle: function(obj, type){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/settings/google/' + type, obj);
        },
        saveMail: function(obj, type){
            return DALSrvc.getPromise('save', StcAppSetting.admin + '/json/settings/mail/' + type, obj);
        }
    }
});
  
