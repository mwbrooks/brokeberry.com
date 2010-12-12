(function() {
    var Case = function(model, os, description, test) {
        this.model = model;
        this.os = os;
        this.description = description;
        this.test = test;
    };
    Case.prototype = {
        matches:function(model, os) {
            if (this.model != 'all' && model != 'all' && this.model != model) return false;
            if (this.os != 'all' && os != 'all' && this.os != os) return false;
            return true;
        },
        run:function() {
            
        }
    };
    var isBB = false,
        bb = 'BlackBerry', // shortcut
        model, os, browser, // detected device settings
        cases = [   /* List of crash/bug cases */
        new Case('9800', 'all', 'Torch users: set an image to percentage width or height, crash your browser.', 
        function(container) {
            var img = document.createElement('img');
            img.src = 'style/images/brokeberry-coming-soon.png';
            container.appendChild(img);
            img.style.width = '60%'; // boom
        })
        ],
        detect = function(ua) {
            // User agent detection.
            if (ua.indexOf(bb) > -1) {
                isBB = true;
                if (ua.indexOf('WebKit') > -1) {
                    os = '6.0.0';
                } else {
                    var tokens = navigator.userAgent.split('/');
                    model = tokens[0].substr(bb.length);
                    os = tokens[1];
                }
            }
        },
        render = function(el) {
            // Renders cases based on detection results.
            var itemTemplate = ['<div class="item">',
                                '   <p>description</p>'
                                '   <a href="javascript:void(0);">Run me</div>'
                                '   <div class="holder"></div>'
                                '</div>'].join('');
            for (var i = 0, l = cases.length; i < l; i++) {
                var t = cases[i];
                if (t.matches(model, os)) {
                    el.innerHTML += itemTemplate.split('description').join(t.description);
                    var n = el.childNodes.length,
                        cont = el.childNodes[n-1],
                        holder = cont.childNodes[2];
                    cont.childNodes[1].addEventListener('click', function(e) {
                        t.test(holder);
                    }, false);
                }
            }
        };
    window.addEventListener('load', function(e) {
        detect(navigator.userAgent);
        render(document.body);
    }, false);
})();