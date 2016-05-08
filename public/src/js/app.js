(function(d, udf) {
    'use strict';

    // just ignore legacy browsers
    if (!'classList' in d.createElement('span')) return;

    var app = {
        pcId: '#page-content',
        $qs: d.querySelector.bind(d),
        $qsa: d.querySelectorAll.bind(d),
        displayLoader: function() {
            var spinner = [
                '<div class="spinner">',
                '<i class="fa fa-spinner fa-spin fa-3x fa-fw margin-bottom"></i>',
                '</div>'
            ];

            return this.$qs(this.pcId).innerHTML = spinner.join('');
        },
        displayFailure: function() {
            return this.$qs(this.pcId).innerHTML = '<h3>Failed to get content. Please try again.</h3>';
        },
        displayContent: function(content) {
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
                this.displayLoader();
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
        var menus = this.$qsa('#nav a');

        [].forEach.call(menus, function(menu) {
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