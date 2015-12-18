/* Setup general page controller */
angular.module('foundationApp')
    .controller('AuthController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initComponents();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = false;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
            settings.signinpage = true;
            settings.bodyClass="login";
        });
    }]);
