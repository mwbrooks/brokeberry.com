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
                    model = ua.match(/BlackBerry (\d{4})/)[1];
                    os = ua.match(/Version\/(\d\.\d\.\d\.\d{3})/)[1];
                } else {
                    var tokens = ua.split('/');
                    model = tokens[0].match(/\d{4}/)[0];
                    os = tokens[1].match(/\d\.\d\.\d\.\d*/)[0];
                }
            } else {
                // Let's see all cases if we're on a non-BlackBerry.
                model = 'all';
                os = 'all';
            }
        },
        render = function(el) {
            // Renders cases based on detection results.
            
            // Item template document fragment.
            var itemTemplate = document.createElement('div');
            itemTemplate.className = "item";
            itemTemplate.appendChild(document.createElement('p'));
            var a = document.createElement('a');
            a.href = '#';
            a.innerHTML = 'Run Me';
            itemTemplate.appendChild(a);
            var h = document.createElement('div');
            h.className = 'holder';
            itemTemplate.appendChild(h);
            
            // Test case "Run Me" click closure.
            var closure = function(testcase, holder) {
                return function(e) {
                    holder.innerHTML = '';
                    testcase.test(holder);
                    this.innerHTML = 'Run me again';
                    return false;
                }
            };
            
            // Loop over results and render cases.
            for (var i = 0, l = cases.length; i < l; i++) {
                var t = cases[i];
                if (t.matches(model, os)) {
                    var node = itemTemplate.cloneNode(true);
                    node.childNodes[0].innerHTML = t.description;
                    var holder = node.childNodes[2],
                        a = node.childNodes[1];
                        
                    a.addEventListener('click', closure(t, holder), false);
                    el.appendChild(node);
                }
            }
        };
    window.addEventListener('load', function(e) {
        detect(navigator.userAgent);
        render(document.getElementById('tests'));
    }, false);
})();