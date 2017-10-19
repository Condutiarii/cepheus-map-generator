/* global Storage, UI, Core, Dice */

/**
 * @author Condutiarii (R.Martinet)
 */
document.addEventListener("DOMContentLoaded", function () {
    var locale = new Storage('exemple'); //local + non strict
    //valeur simple
    locale.set('board', 'Exemple');
    //Creation page 0 à 10
    for (var i = 0; i < 11; i++) {
        locale.set('page', Dice.random(1, 6), i);
    }
    //test ecrasement valeur
    try {
        locale.set('page', 6, 6);
    } catch (e) {
        console.log(e.message, e.name);
    }
    //suppression page 10
    locale.delete('page', 10);
    var coll = locale.collection('page');
    //affichage storage
    console.log(locale.definition);
    //création des div
    var div = [];
    //récupère les index de la collection "page" puis les mélange
    coll.shuffle();
    coll.forEach(function (element) {
        var value = locale.get('page', element);
        (div[element] = new UI('div', {
            class: 'initial'
        }, 'exemple'))
            .on('container')
            .text('page : ' + value)
            .mouseover('over')
            .attach('click', function () {
                var dice = Core.random(1, 6);
                div[element].text('page : ' + dice);
                div[element].classList.toggle('click');
                div[element].style({
                    color: dice > 5 ? 'red' : 'black',
                });
            })
            .style({
                fontWeight: 'bold',
                color: value > 5 ? 'red' : 'black',
                width: '400px',
                height: '30px'
            });
    });
});

