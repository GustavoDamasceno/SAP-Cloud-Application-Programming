sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'solar.project1',
            componentId: 'ProductsList',
            contextPath: '/Products'
        },
        CustomPageDefinitions
    );
});