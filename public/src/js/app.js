(function(d, udf) {
    'use strict';

    // just ignore legacy browsers
    if (!'classList' in d.createElement('span')) return;

    var app = {
        pcId: '#page-content',
        soId: '#spinner-overlay',
        scId: '#spinner-content',
        $qs: d.querySelector.bind(d),
        $qsa: d.querySelectorAll.bind(d),
        showSpinner: function() {
            this.$qs(this.soId).style.display = 'block';
            this.$qs(this.scId).style.display = 'block';
        },
        hideSpinner: function() {
            this.$qs(this.soId).style.display = 'none';
            this.$qs(this.scId).style.display = 'none';
        },
        displayFailure: function() {
            return this.$qs(this.pcId).innerHTML = '<h3>Failed to get content. Please try again.</h3>';
        },
        displayContent: function(content) {
            this.hideSpinner();
            return this.$qs(this.pcId).innerHTML = content;
        },
        getPath: function(url) {
            return ['./public/views/' , url , '.html'].join('') || '/';
        },
        applyActiveClass: function(menuId) {
            var activeClass = 'active';

            [].forEach.call(this.$qsa('#nav a.active'), function(menu) {
                menu.classList.remove(activeClass);
            });

            return this.$qs('#' + menuId).classList.add(activeClass);
        },
        request: function(url, cb) {
            if (cb === udf) throw new Error('Invalid callback function');
            var xhr = new XMLHttpRequest();

            xhr.onloadstart = function() {
                this.applyActiveClass(url);
                this.showSpinner();
            }.bind(this);

            xhr.onerror = function() {
                this.displayFailure();
            }.bind(this);

            xhr.onload = function() {
                if (this.status == 200) {
                    setTimeout(function() {
                        return cb(xhr.responseText);
                    }, 500);
                }
            };

            xhr.open('GET', this.getPath(url), true);
            xhr.send();
        },
        set: function(path) {
            return page('/' + path, function(ctx) {
                if (ctx.state[path]) {
                    this.applyActiveClass(path);
                    this.displayContent(ctx.state[path]);
                } else {
                    this.request(path, function(response) {
                        ctx.state[path] = response;
                        ctx.save();
                        this.displayContent(response);
                    }.bind(this));
                }
            }.bind(this));
        }
    };

    var run = function() {
        [].forEach.call(this.$qsa('#nav a'), function(menu) {
            if (menu.id) this.set(menu.id);
        }.bind(this));

        page('*', function() {
            return page.redirect('/about');
        });

        page({ hashbang: true });
    };

    if (Document !== udf) {
        d.addEventListener('DOMContentLoaded', run.bind(app));
    }
}(document, undefined));