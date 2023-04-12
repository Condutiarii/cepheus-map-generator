/* global UI, CepheusMap, CepheusEngine */

/**
 * @author Condutiarii (R.Martinet)
 */
document.addEventListener("DOMContentLoaded", function () {
    UI('button', {class: 'btn btn-default btn-lg'})
        .on('actions')
        .text('Regenerate')
        .attach('click', CepheusEngine(CepheusMap, {
            density: 4,
            map: 'map',
            information: 'description'
        }))
        .attach('click', function () {
            document.querySelectorAll('[id^=starbody]').forEach(function (starBody) {
                const classEffect = "blink-effect-" + Dice.d20();
                starBody.classList.add(classEffect);
                starBody.nextElementSibling.classList.add(classEffect);
            });
        })
        .trigger('click');
});

