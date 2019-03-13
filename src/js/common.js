document.body.onload = function () {
    setTimeout(function () {
        var preloader = document.getElementById('preloader');
        if (!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 1000);


    document.forms[0].onsubmit = function (event) {
        event.preventDefault();
        var form = $('form');
        var data = form.serialize();
        var url = form.attr('action');
        console.log('data: ' + data, 'url: ' + url);

        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (resp) {
                //console.log(resp);

                var form_new = document.createElement('form');
                form_new.id = 'payment';
                form_new.action = 'https://pay.piastrix.com/ru/pay';
                form_new.method = 'post';
                document.body.appendChild(form_new);

                form = $('form#payment');
                form.append('<input type="hidden" name="amount" value="' + resp.amount + '" />');
                form.append('<input type="hidden" name="currency" value="' + resp.currency + '" />');
                form.append('<input type="hidden" name="description" value="' + resp.description + '" />');
                form.append('<input type="hidden" name="payway" value="' + resp.payway + '" />');
                form.append('<input type="hidden" name="shop_id" value="' + resp.shop_id + '" />');
                form.append('<input type="hidden" name="shop_order_id" value="' + resp.shop_order_id + '" />');
                form.append('<input type="hidden" name="sign" value="' + resp.sign + '" />');
                $('form#payment').submit();
            }//success
        });// ajax
    }//document.forms
};


// $(window).load(function () {
//     setTimeout(function () {
//         $('.preloader').fadeOut('slow');
//
//     },1000);
// });
