// document.body.onload = function () {
//     setTimeout(function() {
//         var preloader = document.getElementById('preloader');
//         if( !preloader.classList.contains('done') ) {
//             preloader.classList.add('done');
//         }
//     }, 1000);
// };


$(window).load(function () {
    setTimeout(function () {
        $('.preloader').fadeOut('slow');

    },1000);
});