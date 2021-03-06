/* global Storage, UI, Core, Dice */

/**
 * Sample
 * 
 * @author Condutiarii (R.Martinet)
 */
document.addEventListener("DOMContentLoaded", function () {
    var local = new Storage('sample'); // local + non strict
    // Simple value
    local.set('board', 'Sample');
    //Create page 0 à 10
    for (var i = 0; i < 11; i++) {
        local.set('page', Dice.random(1, 6), i);
    }
    // Override value
    try {
        local.set('page', 6, 6);
    } catch (e) {
        console.log(e.message, e.name);
    }
    // Delete page 10
    local.delete('page', 10);
    var coll = local.collection('page');
    // Show storage
    console.log(local.definition);
    // Create some divs
    var div = [];
    // Retrieves indexes from the "page" collection and mixes them together
    coll.shuffle();
    coll.forEach(function (element) {
        var value = local.get('page', element);
        (div[element] = new UI('div', {
            class: 'initial'
        }, 'sample'))
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

