/* global UI, CepheusMap, CepheusEngine */

/**
 * @author Condutiarii (R.Martinet)
 */
document.addEventListener("DOMContentLoaded", function () {
    UI('button', {})
        .on('container')
        .text('Regenerate')
        .attach('click', CepheusEngine(CepheusMap, { density: 4, map: 'map', information: 'description' }))
        .trigger('click');
    UI('button', {})
        .on('container')
        .text('Show')
        .attach('click', function () {
            var collection = document.querySelectorAll('.information');
            if (!collection.forEach) { //firefox
                for (var element in collection) {
                    collection[element].style.visibility = 'visible';
                }
            } else { //chrome
                collection.forEach(function (element) {
                    element.style.visibility = 'visible';
                });
            }
        });
});

