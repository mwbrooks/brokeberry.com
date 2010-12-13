(function() {
    var isBB = false,
        bb = 'BlackBerry', // shortcut
        model, os, browser, // detected device settings
        detect = function(ua) {
            // User agent detection.
            if (ua.indexOf(bb) > -1) {
                isBB = true;
                if (ua.indexOf('WebKit') > -1) {
                    // Regex to catch important tidbits out of this sort of format:
                    // Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en-US) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.141 Mobile Safari/534.1
                    model = t.match(/BlackBerry (\d{4}])/)[1];
                    os = t.match(/Version\/(\d\.\d\.\d\.\d{3})/)[1];
                } else {
                    var tokens = navigator.userAgent.split('/');
                    model = tokens[0].match(/\d{4}/)[0];
                    os = tokens[1].match(/\d\.\d\.\d\.\d*/)[0];
                }
            }
        },
        render = function(el) {
            // Renders cases based on detection results.
            var itemTemplate = ['<div class="item">',
                                '   <p>description</p>',
                                '   <a href="javascript:void(0);">Run me</div>',
                                '   <div class="holder"></div>',
                                '</div>'].join('');
            for (var i = 0, l = cases.length; i < l; i++) {
                var t = cases[i];
                if (t.matches(model, os)) {
                    el.innerHTML += itemTemplate.split('description').join(t.description);
                    var n = el.childNodes.length,
                        cont = el.childNodes[n-1],
                        holder = cont.childNodes[2],
                        listener = function(e) {
                            holder.innerHTML = '';
                            t.test(holder);
                            this.innerHTML = 'Run me again';
                        };
                    cont.childNodes[1].addEventListener('click', listener, false);
                }
            }
        };
    window.addEventListener('load', function(e) {
        detect(navigator.userAgent);
        render(document.body);
    }, false);
})();