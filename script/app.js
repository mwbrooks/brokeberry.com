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
            var itemTemplate = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#';
            itemTemplate.appendChild(a);
            
            // Element that will hold test case stuff.
            var holder = document.getElementById('holder');
            
            // Test case "Run Me" click closure.
            var closure = function(testcase) {
                return function(e) {
                    holder.innerHTML = '';
                    testcase.test(holder);
                    document.getElementById('description').innerHTML = testcase.description;
                    document.getElementById('title').innerHTML = testcase.title;
                    document.getElementById('tests').style.display = 'none';
                    holder.parentNode.style.display = '';
                    return false;
                }
            };
            
            // Loop over results and render cases.
            for (var i = 0, l = cases.length; i < l; i++) {
                var t = cases[i];
                if (t.matches(model, os)) {
                    var node = itemTemplate.cloneNode(true),
                        a = node.childNodes[0];
                    a.addEventListener('click', closure(t), false);
                    a.innerHTML = t.title;
                    el.appendChild(node);
                }
            }
        };
    window.addEventListener('load', function(e) {
        detect(navigator.userAgent);
        render(document.getElementById('tests'));
    }, false);
})();