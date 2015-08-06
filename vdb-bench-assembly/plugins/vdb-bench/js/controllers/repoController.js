var vdbBench = (function(vdbBench) {

    vdbBench.RepoController = vdbBench._module
            .controller(
                    'vdbBench.RepoController',
                    [
                            '$scope',
                            'repositoryService',
                            function($scope, repositoryService) {

                                var repoEditBaseConfig = {
                                        "id" : 'repoEditForm',
                                        "style" : HawtioForms.FormStyle.HORIZONTAL,
                                        "mode" : HawtioForms.FormMode.EDIT,
                                        "disableHumanizeLabel" : false,
                                        "hideLegend" : false,
                                        "controls" : [ "*" ],
                                        "properties" : {
                                            "hostname" : {
                                                type : 'text',
                                                'input-attributes' : {
                                                    'required' : 'true',
                                                }
                                            },
                                            "port" : {
                                                "type": "Integer",
                                                "input-attributes": {
                                                    'required' : 'true',
                                                    'min' : 1000,
                                                    'max' : 65535
                                                }
                                            }
                                        },
                                        "description" : "Repository Properties",
                                        "type" : "java.lang.String"
                                    };

                                // model variable, supplies initial selected value
                                $scope.selectedRepo = repositoryService.getSelected();

                                // Watch the selectedRepo so that if its properties change
                                // they need to be preserved by the repository service
                                $scope.$watch('selectedRepo', function(newValue, oldValue) {
                                    repositoryService.saveRepositories();
                                }, true);

                                // Fetch the repositories from the service
                                $scope.repositories = function() {
                                    return repositoryService.getRepositories();
                                };

                                // On change of selection update the service
                                $scope.changeSelection = function(selectedRepo) {
                                    repositoryService.setSelected(selectedRepo);
                                };

                                // Is a repository selected
                                $scope.isRepositorySelected = function() {
                                    return repositoryService
                                            .isRepositorySelected();
                                }

                                // Is localhost repository selected
                                $scope.isLocalhostSelected = function() {
                                    return repositoryService
                                            .isLocalhostSelected();
                                }

                                function getRepoEditConfig() {
                                    var repoEditConfig = _.clone(repoEditBaseConfig, true);
                                    var hostNameExt = {
                                            "properties" : {
                                                "hostname" : {
                                                    type : 'text',
                                                    'input-attributes' : {
                                                        'required' : 'true',
                                                        'readOnly' : 'true'
                                                    }
                                                }
                                            }
                                        };

                                    if (repositoryService.isLocalhostSelected()) {
                                        repoEditConfig = _.merge(repoEditConfig, hostNameExt);
                                    }

                                    return repoEditConfig;
                                };

                                $scope.repoEditConfig = getRepoEditConfig();

                                // If the service changes its selection then it
                                // should notify this controller
                                $scope
                                        .$on(
                                                'selectedRepoChanged',
                                                function() {

                                                    // Refresh the selected repo field to in turn refresh
                                                    // any controls depending on it.
                                                    if ($scope.selectedRepo != repositoryService.getSelected())
                                                        $scope.selectedRepo = repositoryService.getSelected();

                                                    $scope.repoEditConfig = getRepoEditConfig();
                                                });

                            } ]);
    return vdbBench;

})(vdbBench || {});