(function(w, d, udf) {
    'use strict';

    // just ignore legacy browsers
    if (!'classList' in d.createElement('span')) return;

    var xhr;
    var $qs = d.querySelector.bind(d);
    var $qsa = d.querySelectorAll.bind(d);
    var app = {
        pcId: '#page-content',
        soId: '#spinner-overlay',
        scId: '#spinner-content',
        goTop: function() {
            return w.scrollTo(0, 0);
        },
        showSpinner: function() {
            $qs(this.soId).style.display = 'block';
            $qs(this.scId).style.display = 'block';
        },
        hideSpinner: function() {
            $qs(this.soId).style.display = 'none';
            $qs(this.scId).style.display = 'none';
        },
        displayFailure: function() {
            return $qs(this.pcId).innerHTML = '<h3>Failed to get content. Please try again.</h3>';
        },
        displayContent: function(content) {
            this.goTop();
            this.hideSpinner();
            return $qs(this.pcId).innerHTML = content;
        },
        getPath: function(url) {
            return ['./public/views/', url, '.html'].join('') || '/';
        },
        applyActiveClass: function(menuId) {
            var activeClass = 'active';

            [].map.call($qsa('#nav a.active'), function(menu) {
                menu.classList.remove(activeClass);
            });

            return $qs('#' + menuId).classList.add(activeClass);
        },
        request: function(url, cb) {
            if (cb === udf) throw new Error('Invalid callback function');
            if (xhr && xhr.readyState != 4) xhr.abort();
            xhr = new XMLHttpRequest();

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
                    }, 300);
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
        },
        showStickyNav: function() {
            var minTop = 200,
                $pageContent = $qs('#page-content'),
                $nav = $qs('#nav'),
                spanBottomClass = 'spanBottom',
                stickyClass = 'sticky';

            return setTimeout(function() {
                if (d.body.scrollTop > minTop || d.documentElement.scrollTop > minTop) {
                    $nav.classList.add(stickyClass);
                    $pageContent.classList.add(spanBottomClass);
                } else {
                    $nav.classList.remove(stickyClass);
                    $pageContent.classList.remove(spanBottomClass);
                }
            }, 100);
        }
    };
    var run = function() {
        [].map.call($qsa('#nav a'), function(menu) {
            if (menu.id) this.set(menu.id);
        }.bind(this));

        page('*', function() {
            return page.redirect('/about');
        });

        page({ hashbang: true });
    };

    if (Document !== udf) {
        w.addEventListener('scroll', function(e) {
            if (scrollDelay) clearTimeout(scrollDelay);
            var scrollDelay = app.showStickyNav();
        });

        d.addEventListener('DOMContentLoaded', run.bind(app));
    }
}(window, document, undefined));