/* 
 * Script que cuida das tabelas de listagens
 */
;
(function ($) {
    'use strict';
    var InputSearch = function (options) {
        var publicMethods = {};
        var defaultOptions = {
            callback: function (r) {
                console.log(r);
            },
            remoteSource: "",
            input: '.inputsearch',
            dataSource: [{name: 'alex', idade: 22}, {name: 'souza', idade: 32} ],
            propertySearch: 'name',
            postData: {classe: '', method: ''}
        };
        var settings = $.extend({}, defaultOptions, options);
        var valueSearch = "";
        var lastValueSearch = "";
        var keyTimeout = 0;
        var keyTimeoutLength = 500;

        publicMethods.setPostData = function (postData) {
            if (postData) {
                settings.postData = $.extend({}, settings.postData, postData);
            }
        };

        function isValidRequest() {
            valueSearch = $(settings.input).val();
            if (valueSearch === lastValueSearch) {
                return false;
            }
            lastValueSearch = valueSearch;
            //when remote, wait for send search
            if (keyTimeout) {
                clearTimeout(keyTimeout);
                keyTimeout = 0;
            }
            return true;
        };

        publicMethods.getLocalResult = function () {
            if (!isValidRequest()) return false;
            keyTimeout = setTimeout(searchInLocalData, keyTimeoutLength);
        };

        publicMethods.getRemoteResult = function () {
            if (!isValidRequest())return;
            keyTimeout = setTimeout(searchInRemoteData, keyTimeoutLength);
        };

        //funçao que abstrai o request http, se não usando jQuery, implementar aqui outro
        function ajax(postData, done) {
            $.ajax({
                type: "POST",
                url: settings.remoteSource,
                data: postData
            }).done(done);
        };

        function searchInRemoteData() {
            settings.postData.inputValue = valueSearch;
            ajax(settings.postData, settings.callback);
        }

        function searchInLocalData() {
            var localResult = settings.dataSource.filter(function (element) {
                var name = String(element[settings.propertySearch].toLowerCase());
                return name.match(new RegExp(valueSearch.toLowerCase()));
            });

            if (typeof settings.callback === 'function') {
                settings.callback(localResult);
            }
        }

        return publicMethods;
    };
    window.InputSearch = InputSearch;
})(jQuery);


