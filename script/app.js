(function() {
    /* Case
     * Encapsulates each test case into an atomic unit.
     * @param model         A string or array of BlackBerry models that the case should be run on.
     *                      A model number is four digits. A string type can contain a single 4 digit model,
     *                      or a range with the use of a '-' between two model numbers. An array of model strings
     *                      follows the same rule as a string but you can specify multiple models or model ranges.
     * @param os            A string or array of BlackBerry operating system versions that the case should be run on.
     *                      Follows the same string/array rules as the model parameter above.
     * @param description   A string describing the test case, what causes it and what results from it.
     * @param test          A callback function taking one parameter. The callback should contain the
     *                      logic to perform that makes up the test case. The parameter to this function is a DOM
     *                      element that the test case can use to inject manipulate the DOM.
     **/
    var Case = function(model, os, description, test) {
        this.model = model;
        this.os = os;
        this.description = description;
        this.test = test;
    };
    Case.prototype = {
        matches:function(model, os) {
            if (!this.matchesModel(model) || !this.matchesOS(os)) return false;
            return true;
        },
        matchesOS:function(os) {
            var t = this.os.split('.'),
                o = os.split('.');
            for (var i = 0, l = t.length; i < l; i++) {
                if (parseInt(o[i]) != parseInt(t[i])) return false;
            }
        },
        matchesModel:function(model){
            var isRange = function(str) {
                if (str.indexOf('-') > -1) return true;
                else return false;
                }, inRange = function(val, range) {
                    var spread = range.split('-'),
                        min = parseInt(range[0]),
                        max = parseInt(range[1]);
                    if (typeof val == 'string') val = parseInt(val);
                    if (val >= min && val <= max) return true;
                    else return false;
                }, isMatch = function(one, two) {
                    if (isRange(one)) return inRange(one, two);
                    else {
                        if (parseInt(two) == parseInt(one)) return true;
                        else return false;
                    }
                };
                
            if (typeof this.model == 'object' && this.model instanceof Array) {
                var ret = true;
                for (var i = 0, l = this.model.length; i < l; i++) {
                    var c = this.model[i];
                    if (!isMatch(c, model)) return false;
                }
                return true;
            } else {
                return isMatch(this.model, model);
            }
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