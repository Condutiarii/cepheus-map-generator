/* global UI, CepheusMap, CepheusEngine */

/**
 * @author Condutiarii (R.Martinet)
 */
document.addEventListener("DOMContentLoaded", function () {
    UI('button', { class: 'btn btn-default btn-lg' })
        .on('actions')
        .text('Regenerate')
        .attach('click', CepheusEngine(CepheusMap, {
            density: 4,
            map: 'map',
            information: 'description'
        }))
        .trigger('click');
});

