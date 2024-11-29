sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'solar/project1/test/integration/FirstJourney',
		'solar/project1/test/integration/pages/ProductsList',
		'solar/project1/test/integration/pages/ProductsObjectPage'
    ],
    function(JourneyRunner, opaJourney, ProductsList, ProductsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('solar/project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheProductsList: ProductsList,
					onTheProductsObjectPage: ProductsObjectPage
                }
            },
            opaJourney.run
        );
    }
);