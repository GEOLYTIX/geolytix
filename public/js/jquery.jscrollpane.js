/*

 THIS IS A HEAVILY MODIFIED VERSION OF THE BELOW PLUGIN.
 I REMOVED HORIZONTAL BARS AS I DO NOT NEED THEM.
 I REMOVED ARROWS AS I DON'T LIKE THEM.
 I CHANGED THE INITIALISATION TO A WINDOW CHANGE SIZE EVENT INSTEAD OF AN INTERVAL.
 --DBZ

 jScrollPane - v2.0.23 - 2016-01-28
 http://jscrollpane.kelvinluck.com/

 Project Home - http://jscrollpane.kelvinluck.com/
 GitHub       - http://github.com/vitch/jScrollPane

 Copyright (c) 2014 Kelvin Luck
 Dual licensed under the MIT or GPL Version 2 licenses.
 http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
 http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt

 jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
 Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8

 2.0.23 - (2016-01-28) Various
 2.0.22 - (2015-04-25) Resolve a memory leak due to an event handler that isn't cleaned up in destroy (thanks @timjnh)
 2.0.21 - (2015-02-24) Simplify UMD pattern: fixes browserify when loading jQuery outside of bundle
 2.0.20 - (2014-10-23) Adds AMD support (thanks @carlosrberto) and support for overflow-x/overflow-y (thanks @darimpulso)
 2.0.19 - (2013-11-16) Changes for more reliable scroll amount with latest mousewheel plugin (thanks @brandonaaron)
 2.0.18 - (2013-10-23) Fix for issue with gutters and scrollToElement (thanks @Dubiy)
 2.0.17 - (2013-08-17) Working correctly when box-sizing is set to border-box (thanks @pieht)
 2.0.16 - (2013-07-30) Resetting left position when scroll is removed. Fixes #189
 2.0.15 - (2013-07-29) Fixed issue with scrollToElement where the destX and destY are undefined.
 2.0.14 - (2013-05-01) Updated to most recent mouse wheel plugin (see #106) and related changes for sensible scroll speed
 2.0.13 - (2013-05-01) Switched to semver compatible version name
 2.0.0beta12 - (2012-09-27) fix for jQuery 1.8+
 2.0.0beta11 - (2012-05-14)
 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
 2.0.0beta2 - (2010-08-21) Bug fixes
 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden elements and dynamically sized elements.
 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.jScrollPane = function (settings) {
        // public methods are available through $('selector').data('jsp')
        function JScrollPane(elem, s) {
            var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY, verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition, verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, horizontalBar, originalPadding, wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false, originalElement = elem.clone(false, false).empty(), mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

            $(window).resize(function () {
                initialise(settings);
            });

            function initialise(s) {

                var isMaintainingPositon, lastContentX, lastContentY, originalScrollTop, originalScrollLeft, maintainAtBottom = false, maintainAtRight = false;

                settings = s;

                if (pane === undefined) {
                    originalScrollTop = elem.scrollTop();
                    originalScrollLeft = elem.scrollLeft();
                    elem.css(
                        {
                            overflow: 'hidden',
                            padding: 0
                        }
                    );
                    paneHeight = elem.innerHeight();

                    pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
                    container = $('<div class="jspContainer" />')
                        .css({
                            'height': paneHeight + 'px'
                        })
                        .append(pane).appendTo(elem);

                } else {

                    maintainAtBottom = settings.stickToBottom && isCloseToBottom();
                    maintainAtRight = settings.stickToRight && isCloseToRight();

                    if (elem.outerHeight() != paneHeight) {
                        paneHeight = elem.innerHeight();
                        container.css({
                            height: paneHeight + 'px'
                        });
                    }

                    container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
                }

                pane.css('overflow', 'auto');
                contentHeight = pane[0].scrollHeight;
                pane.css('overflow', '');
                percentInViewV = contentHeight / paneHeight;
                isScrollableV = percentInViewV > 1;

                if (!(isScrollableH || isScrollableV)) {
                    elem.removeClass('jspScrollable');
                    pane.css({
                        top: 0,
                        left: 0
                    });
                    removeMousewheel();
                    removeFocusHandler();
                    removeKeyboardNav();
                    removeClickOnTrack();

                } else {
                    elem.addClass('jspScrollable');
                    isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
                    if (isMaintainingPositon) {
                        lastContentX = contentPositionX();
                        lastContentY = contentPositionY();
                    }

                    initialiseVerticalScroll();
                    resizeScrollbars();

                    if (isMaintainingPositon) {
                        scrollToX(maintainAtRight ? (contentWidth - paneWidth ) : lastContentX, false);
                        scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
                    }

                    initFocusHandler();
                    initMousewheel();
                    initTouch();

                    if (settings.enableKeyboardNavigation) {
                        initKeyboardNav();
                    }
                    if (settings.clickOnTrack) {
                        initClickOnTrack();
                    }

                    observeHash();
                    if (settings.hijackInternalLinks) {
                        hijackInternalLinks();
                    }
                }

                originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
                originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

                elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
            }

            function initialiseVerticalScroll() {
                if (isScrollableV) {

                    container.append(
                        $('<div class="jspVerticalBar" />').append(
                            $('<div class="jspCap jspCapTop" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragTop" />'),
                                    $('<div class="jspDragBottom" />')
                                )
                            ),
                            $('<div class="jspCap jspCapBottom" />')
                        )
                    );

                    verticalBar = container.find('>.jspVerticalBar');
                    verticalTrack = verticalBar.find('>.jspTrack');
                    verticalDrag = verticalTrack.find('>.jspDrag');
                    verticalTrackHeight = paneHeight;

                    verticalDrag.hover(
                        function () {
                            verticalDrag.addClass('jspHover');
                        },
                        function () {
                            verticalDrag.removeClass('jspHover');
                        })
                        .bind('mousedown.jsp', function (e) {
                                // Stop IE from allowing text selection
                                $('html').bind('dragstart.jsp selectstart.jsp', nil);
                                verticalDrag.addClass('jspActive');
                                var startY = e.pageY - verticalDrag.position().top;
                                $('html').bind('mousemove.jsp', function (e) {
                                    positionDragY(e.pageY - startY, false);
                                })
                                    .bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                                return false;
                            }
                        );
                    sizeVerticalScrollbar();
                }
            }

            function sizeVerticalScrollbar() {
                verticalTrack.height(verticalTrackHeight + 'px');
                verticalDragPosition = 0;
                scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();
                try {
                    if (verticalBar.position().left === 0) {
                        pane.css('margin-left', scrollbarWidth + 'px');
                    }
                } catch (err) {
                    console.log(err.toString());
                }
            }

            function resizeScrollbars() {
                if (isScrollableH && isScrollableV) {
                    paneHeight -= verticalTrack.outerWidth();
                    sizeVerticalScrollbar();
                }

                contentHeight = pane.outerHeight();
                percentInViewV = contentHeight / paneHeight;

                if (isScrollableV) {
                    verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
                    if (verticalDragHeight > settings.verticalDragMaxHeight) {
                        verticalDragHeight = settings.verticalDragMaxHeight;
                    } else if (verticalDragHeight < settings.verticalDragMinHeight) {
                        verticalDragHeight = settings.verticalDragMinHeight;
                    }
                    verticalDrag.height(verticalDragHeight + 'px');
                    dragMaxY = verticalTrackHeight - verticalDragHeight;
                    _positionDragY(verticalDragPosition);
                }
            }


            function initClickOnTrack() {
                removeClickOnTrack();
                if (isScrollableV) {
                    verticalTrack.bind(
                        'mousedown.jsp',
                        function (e) {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                    offset = clickedTrack.offset(),
                                    direction = e.pageY - offset.top - verticalDragPosition,
                                    scrollTimeout,
                                    isFirst = true,
                                    doScroll = function () {
                                        var offset = clickedTrack.offset(),
                                            pos = e.pageY - offset.top - verticalDragHeight / 2,
                                            contentDragY = paneHeight * settings.scrollPagePercent,
                                            dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
                                        if (direction < 0) {
                                            if (verticalDragPosition - dragY > pos) {
                                                jsp.scrollByY(-contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else if (direction > 0) {
                                            if (verticalDragPosition + dragY < pos) {
                                                jsp.scrollByY(contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else {
                                            cancelClick();
                                            return;
                                        }
                                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                        isFirst = false;
                                    },
                                    cancelClick = function () {
                                        scrollTimeout && clearTimeout(scrollTimeout);
                                        scrollTimeout = null;
                                        $(document).unbind('mouseup.jsp', cancelClick);
                                    };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                    );
                }
            }

            function removeClickOnTrack() {
                if (verticalTrack) {
                    verticalTrack.unbind('mousedown.jsp');
                }
            }

            function cancelDrag() {
                $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');
                if (verticalDrag) {
                    verticalDrag.removeClass('jspActive');
                }
            }

            function positionDragY(destY, animate) {
                if (!isScrollableV) {
                    return;
                }
                if (destY < 0) {
                    destY = 0;
                } else if (destY > dragMaxY) {
                    destY = dragMaxY;
                }

                // allow for devs to prevent the JSP from being scrolled
                var willScrollYEvent = new $.Event("jsp-will-scroll-y");
                elem.trigger(willScrollYEvent, [destY]);

                if (willScrollYEvent.isDefaultPrevented()) {
                    return;
                }

                var tmpVerticalDragPosition = destY || 0;

                var isAtTop = tmpVerticalDragPosition === 0,
                    isAtBottom = tmpVerticalDragPosition == dragMaxY,
                    percentScrolled = destY / dragMaxY,
                    destTop = -percentScrolled * (contentHeight - paneHeight);

                // can't just check if(animate) because false is a valid value that could be passed in...
                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(verticalDrag, 'top', destY, _positionDragY, function () {
                        elem.trigger('jsp-user-scroll-y', [-destTop, isAtTop, isAtBottom]);
                    });
                } else {
                    verticalDrag.css('top', destY);
                    _positionDragY(destY);
                    elem.trigger('jsp-user-scroll-y', [-destTop, isAtTop, isAtBottom]);
                }

            }

            function _positionDragY(destY) {
                if (destY === undefined) {
                    destY = verticalDrag.position().top;
                }

                container.scrollTop(0);
                verticalDragPosition = destY || 0;

                var isAtTop = verticalDragPosition === 0,
                    isAtBottom = verticalDragPosition == dragMaxY,
                    percentScrolled = destY / dragMaxY,
                    destTop = -percentScrolled * (contentHeight - paneHeight);

                if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
                    wasAtTop = isAtTop;
                    wasAtBottom = isAtBottom;
                }

                pane.css('top', destTop);
                elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
            }

            function positionDragX(destX, animate) {
                if (!isScrollableH) {
                    return;
                }
                if (destX < 0) {
                    destX = 0;
                } else if (destX > dragMaxX) {
                    destX = dragMaxX;
                }


                // allow for devs to prevent the JSP from being scrolled
                var willScrollXEvent = new $.Event("jsp-will-scroll-x");
                elem.trigger(willScrollXEvent, [destX]);

                if (willScrollXEvent.isDefaultPrevented()) {
                    return;
                }

                var tmpHorizontalDragPosition = destX || 0;

                var isAtLeft = tmpHorizontalDragPosition === 0,
                    isAtRight = tmpHorizontalDragPosition == dragMaxX,
                    percentScrolled = destX / dragMaxX,
                    destLeft = -percentScrolled * (contentWidth - paneWidth);

                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(horizontalDrag, 'left', destX, _positionDragX, function () {
                        elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
                    });
                } else {
                    horizontalDrag.css('left', destX);
                    _positionDragX(destX);
                    elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
                }
            }

            function _positionDragX(destX) {
                if (destX === undefined) {
                    destX = horizontalDrag.position().left;
                }

                container.scrollTop(0);
                horizontalDragPosition = destX || 0;

                var isAtLeft = horizontalDragPosition === 0,
                    isAtRight = horizontalDragPosition == dragMaxX,
                    percentScrolled = destX / dragMaxX,
                    destLeft = -percentScrolled * (contentWidth - paneWidth);

                if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
                    wasAtLeft = isAtLeft;
                    wasAtRight = isAtRight;
                }

                pane.css('left', destLeft);
                elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
            }

            function scrollToY(destY, animate) {
                var percentScrolled = destY / (contentHeight - paneHeight);
                positionDragY(percentScrolled * dragMaxY, animate);
            }

            function scrollToX(destX, animate) {
                var percentScrolled = destX / (contentWidth - paneWidth);
                positionDragX(percentScrolled * dragMaxX, animate);
            }

            function scrollToElement(ele, stickToTop, animate) {
                var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

                // Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
                // errors from the lookup...
                try {
                    e = $(ele);
                } catch (err) {
                    return;
                }
                eleHeight = e.outerHeight();
                eleWidth = e.outerWidth();

                container.scrollTop(0);
                container.scrollLeft(0);

                // loop through parents adding the offset top of any elements that are relatively positioned between
                // the focused element and the jspPane so we can get the true distance from the top
                // of the focused element to the top of the scrollpane...
                while (!e.is('.jspPane')) {
                    eleTop += e.position().top;
                    eleLeft += e.position().left;
                    e = e.offsetParent();
                    if (/^body|html$/i.test(e[0].nodeName)) {
                        // we ended up too high in the document structure. Quit!
                        return;
                    }
                }

                viewportTop = contentPositionY();
                maxVisibleEleTop = viewportTop + paneHeight;
                if (eleTop < viewportTop || stickToTop) {
                    // element is above viewport
                    destY = eleTop - settings.horizontalGutter;
                } else if (eleTop + eleHeight > maxVisibleEleTop) {
                    // element is below viewport
                    destY = eleTop - paneHeight + eleHeight + settings.horizontalGutter;
                }
                if (!isNaN(destY)) {
                    scrollToY(destY, animate);
                }

                viewportLeft = contentPositionX();
                maxVisibleEleLeft = viewportLeft + paneWidth;
                if (eleLeft < viewportLeft || stickToTop) {
                    // element is to the left of viewport
                    destX = eleLeft - settings.horizontalGutter;
                } else if (eleLeft + eleWidth > maxVisibleEleLeft) {
                    // element is to the right viewport
                    destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
                }
                if (!isNaN(destX)) {
                    scrollToX(destX, animate);
                }

            }

            function contentPositionX() {
                return -pane.position().left;
            }

            function contentPositionY() {
                return -pane.position().top;
            }

            function isCloseToBottom() {
                var scrollableHeight = contentHeight - paneHeight;
                return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
            }

            function isCloseToRight() {
                var scrollableWidth = contentWidth - paneWidth;
                return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
            }

            function initMousewheel() {
                container.unbind(mwEvent).bind(
                    mwEvent,
                    function (event, delta, deltaX, deltaY) {
                        if (!horizontalDragPosition) horizontalDragPosition = 0;
                        if (!verticalDragPosition) verticalDragPosition = 0;
                        var dX = horizontalDragPosition, dY = verticalDragPosition, factor = event.deltaFactor || settings.mouseWheelSpeed;
                        jsp.scrollBy(deltaX * factor, -deltaY * factor, false);
                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                );
            }

            function removeMousewheel() {
                container.unbind(mwEvent);
            }

            function nil() {
                return false;
            }

            function initFocusHandler() {
                pane.find(':input,a').unbind('focus.jsp').bind(
                    'focus.jsp',
                    function (e) {
                        scrollToElement(e.target, false);
                    }
                );
            }

            function removeFocusHandler() {
                pane.find(':input,a').unbind('focus.jsp');
            }

            function initKeyboardNav() {
                var keyDown, elementHasScrolled, validParents = [];
                isScrollableH && validParents.push(horizontalBar[0]);
                isScrollableV && validParents.push(verticalBar[0]);

                // IE also focuses elements that don't have tabindex set.
                pane.bind(
                    'focus.jsp',
                    function () {
                        elem.focus();
                    }
                );

                elem.attr('tabindex', 0)
                    .unbind('keydown.jsp keypress.jsp')
                    .bind(
                        'keydown.jsp',
                        function (e) {
                            if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)) {
                                return;
                            }
                            var dX = horizontalDragPosition, dY = verticalDragPosition;
                            switch (e.keyCode) {
                                case 40: // down
                                case 38: // up
                                case 34: // page down
                                case 32: // space
                                case 33: // page up
                                case 39: // right
                                case 37: // left
                                    keyDown = e.keyCode;
                                    keyDownHandler();
                                    break;
                                case 35: // end
                                    scrollToY(contentHeight - paneHeight);
                                    keyDown = null;
                                    break;
                                case 36: // home
                                    scrollToY(0);
                                    keyDown = null;
                                    break;
                            }

                            elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
                            return !elementHasScrolled;
                        }
                    ).bind(
                    'keypress.jsp',
                    // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
                    function (e) {
                        if (e.keyCode == keyDown) {
                            keyDownHandler();
                        }
                        // If the keypress is not related to the area, ignore it. Fixes problem with inputs inside scrolled area. Copied from line 955.
                        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)) {
                            return;
                        }
                        return !elementHasScrolled;
                    }
                );

                if (settings.hideFocus) {
                    elem.css('outline', 'none');
                    if ('hideFocus' in container[0]) {
                        elem.attr('hideFocus', true);
                    }
                } else {
                    elem.css('outline', '');
                    if ('hideFocus' in container[0]) {
                        elem.attr('hideFocus', false);
                    }
                }

                function keyDownHandler() {
                    var dX = horizontalDragPosition, dY = verticalDragPosition;
                    switch (keyDown) {
                        case 40: // down
                            jsp.scrollByY(settings.keyboardSpeed, false);
                            break;
                        case 38: // up
                            jsp.scrollByY(-settings.keyboardSpeed, false);
                            break;
                        case 34: // page down
                        case 32: // space
                            jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 33: // page up
                            jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 39: // right
                            jsp.scrollByX(settings.keyboardSpeed, false);
                            break;
                        case 37: // left
                            jsp.scrollByX(-settings.keyboardSpeed, false);
                            break;
                    }

                    elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
                    return elementHasScrolled;
                }
            }

            function removeKeyboardNav() {
                elem.attr('tabindex', '-1')
                    .removeAttr('tabindex')
                    .unbind('keydown.jsp keypress.jsp');

                pane.unbind('.jsp');
            }

            function observeHash() {
                if (location.hash && location.hash.length > 1) {
                    var e,
                        retryInt,
                        hash = escape(location.hash.substr(1))
                        // hash must be escaped to prevent XSS
                        ;
                    try {
                        e = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (err) {
                        return;
                    }

                    if (e.length && pane.find(hash)) {
                        // nasty workaround but it appears to take a little while before the hash has done its thing to the rendered page so we just wait until the container's scrollTop has been messed up.
                        if (container.scrollTop() === 0) {
                            retryInt = setInterval(
                                function () {
                                    if (container.scrollTop() > 0) {
                                        scrollToElement(e, true);
                                        $(document).scrollTop(container.position().top);
                                        clearInterval(retryInt);
                                    }
                                },
                                50
                            );
                        } else {
                            scrollToElement(e, true);
                            $(document).scrollTop(container.position().top);
                        }
                    }
                }
            }

            function hijackInternalLinks() {
                // only register the link handler once
                if ($(document.body).data('jspHijack')) {
                    return;
                }

                // remember that the handler was bound
                $(document.body).data('jspHijack', true);

                // use live handler to also capture newly created links
                $(document.body).delegate('a[href*="#"]', 'click', function (event) {
                    // does the link point to the same page? this also takes care of cases with a <base>-Tag or Links not starting with the hash #
                    // e.g. <a href="index.html#test"> when the current url already is index.html
                    var href = this.href.substr(0, this.href.indexOf('#')),
                        locationHref = location.href,
                        hash,
                        element,
                        container,
                        jsp,
                        scrollTop,
                        elementTop;
                    if (location.href.indexOf('#') !== -1) {
                        locationHref = location.href.substr(0, location.href.indexOf('#'));
                    }
                    if (href !== locationHref) {
                        // the link points to another page
                        return;
                    }

                    // check if jScrollPane should handle this click event
                    hash = escape(this.href.substr(this.href.indexOf('#') + 1));

                    // find the element on the page element;
                    try {
                        element = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (e) {
                        // hash is not a valid jQuery identifier
                        return;
                    }

                    if (!element.length) {
                        // this link does not point to an element on this page
                        return;
                    }

                    container = element.closest('.jspScrollable');
                    jsp = container.data('jsp');

                    // jsp might be another jsp instance than the one, that bound this event
                    // remember: this event is only bound once for all instances.
                    jsp.scrollToElement(element, true);

                    if (container[0].scrollIntoView) {
                        // also scroll to the top of the container (if it is not visible)
                        scrollTop = $(window).scrollTop();
                        elementTop = element.offset().top;
                        if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
                            container[0].scrollIntoView();
                        }
                    }

                    // jsp handled this event, prevent the browser default (scrolling :P)
                    event.preventDefault();
                });
            }

            // Init touch on iPad, iPhone, iPod, Android
            function initTouch() {
                var startX,
                    startY,
                    touchStartX,
                    touchStartY,
                    moved,
                    moving = false;

                container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
                    'touchstart.jsp',
                    function (e) {
                        var touch = e.originalEvent.touches[0];
                        startX = contentPositionX();
                        startY = contentPositionY();
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;
                        moved = false;
                        moving = true;
                    }
                ).bind(
                    'touchmove.jsp',
                    function (ev) {
                        if (!moving) {
                            return;
                        }

                        var touchPos = ev.originalEvent.touches[0],
                            dX = horizontalDragPosition, dY = verticalDragPosition;

                        jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);

                        moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;

                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                ).bind(
                    'touchend.jsp',
                    function () {
                        moving = false;
                        // if(moved) { return false; }
                    }
                ).bind(
                    'click.jsp-touchclick',
                    function () {
                        if (moved) {
                            moved = false;
                            return false;
                        }
                    }
                );
            }

            function destroy() {
                var currentY = contentPositionY(),
                    currentX = contentPositionX();
                elem.removeClass('jspScrollable').unbind('.jsp');
                pane.unbind('.jsp');
                elem.replaceWith(originalElement.append(pane.children()));
                originalElement.scrollTop(currentY);
                originalElement.scrollLeft(currentX);
            }

            // Public API
            $.extend(
                jsp,
                {
                    // Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it was initialised). The settings object which is passed in will override any settings from the previous time it was initialised - if you don't pass any settings then the ones from the previous initialisation will be used.
                    reinitialise: function (s) {
                        s = $.extend({}, settings, s);
                        initialise(s);
                    },
                    // Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so that it can be seen within the viewport. If stickToTop is true then the element will appear at the top of the viewport, if it is false then the viewport will scroll as little as possible to show the element. You can also specify if you want animation to occur. If you don't provide this argument then the animateScroll value from the settings object is used instead.
                    scrollToElement: function (ele, stickToTop, animate) {
                        scrollToElement(ele, stickToTop, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinates within the content are at the top left of the viewport. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollTo: function (destX, destY, animate) {
                        scrollToX(destX, animate);
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the left of the viewport. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollToX: function (destX, animate) {
                        scrollToX(destX, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the top of the viewport. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollToY: function (destY, animate) {
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollToPercentX: function (destPercentX, animate) {
                        scrollToX(destPercentX * (contentWidth - paneWidth), animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollToPercentY: function (destPercentY, animate) {
                        scrollToY(destPercentY * (contentHeight - paneHeight), animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollBy: function (deltaX, deltaY, animate) {
                        jsp.scrollByX(deltaX, animate);
                        jsp.scrollByY(deltaY, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByX: function (deltaX, animate) {
                        var destX = contentPositionX() + Math[deltaX < 0 ? 'floor' : 'ceil'](deltaX),
                            percentScrolled = destX / (contentWidth - paneWidth);
                        positionDragX(percentScrolled * dragMaxX, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByY: function (deltaY, animate) {
                        var destY = contentPositionY() + Math[deltaY < 0 ? 'floor' : 'ceil'](deltaY),
                            percentScrolled = destY / (contentHeight - paneHeight);
                        positionDragY(percentScrolled * dragMaxY, animate);
                    },
                    // Positions the horizontal drag at the specified x position (and updates the viewport to reflect this). animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    positionDragX: function (x, animate) {
                        positionDragX(x, animate);
                    },
                    // Positions the vertical drag at the specified y position (and updates the viewport to reflect this). animate is optional and if not passed then the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    positionDragY: function (y, animate) {
                        positionDragY(y, animate);
                    },
                    // This method is called when jScrollPane is trying to animate to a new position. You can override it if you want to provide advanced animation functionality. It is passed the following arguments:
                    //  * ele          - the element whose position is being animated
                    //  * prop         - the property that is being animated
                    //  * value        - the value it's being animated to
                    //  * stepCallback - a function that you must execute each time you update the value of the property
                    //  * completeCallback - a function that will be executed after the animation had finished
                    // You can use the default implementation (below) as a starting point for your own implementation.
                    animate: function (ele, prop, value, stepCallback, completeCallback) {
                        var params = {};
                        params[prop] = value;
                        ele.animate(
                            params,
                            {
                                'duration': settings.animateDuration,
                                'easing': settings.animateEase,
                                'queue': false,
                                'step': stepCallback,
                                'complete': completeCallback
                            }
                        );
                    },
                    // Returns the current x position of the viewport with regards to the content pane.
                    getContentPositionX: function () {
                        return contentPositionX();
                    },
                    // Returns the current y position of the viewport with regards to the content pane.
                    getContentPositionY: function () {
                        return contentPositionY();
                    },
                    // Returns the width of the content within the scroll pane.
                    getContentWidth: function () {
                        return contentWidth;
                    },
                    // Returns the height of the content within the scroll pane.
                    getContentHeight: function () {
                        return contentHeight;
                    },
                    // Returns the horizontal position of the viewport within the pane content.
                    getPercentScrolledX: function () {
                        return contentPositionX() / (contentWidth - paneWidth);
                    },
                    // Returns the vertical position of the viewport within the pane content.
                    getPercentScrolledY: function () {
                        return contentPositionY() / (contentHeight - paneHeight);
                    },
                    // Returns whether or not this scrollpane has a horizontal scrollbar.
                    getIsScrollableH: function () {
                        return isScrollableH;
                    },
                    // Returns whether or not this scrollpane has a vertical scrollbar.
                    getIsScrollableV: function () {
                        return isScrollableV;
                    },
                    // Gets a reference to the content pane. It is important that you use this method if you want to edit the content of your jScrollPane as if you access the element directly then you may have some problems (as your original element has had additional elements for the scrollbars etc added into it).
                    getContentPane: function () {
                        return pane;
                    },
                    // Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the animateScroll value from settings is used instead.
                    scrollToBottom: function (animate) {
                        positionDragY(dragMaxY, animate);
                    },
                    // Hijacks the links on the page which link to content inside the scrollpane. If you have changed the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the contents of your scroll pane will work then call this function.
                    hijackInternalLinks: $.noop,
                    // Removes the jScrollPane and returns the page to the state it was in before jScrollPane was initialised.
                    destroy: function () {
                        destroy();
                    }
                }
            );

            initialise(s);
        }

        // Pluginifying code...
        settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

        // Apply default speed
        $.each(['trackClickSpeed', 'keyboardSpeed'], function () {
            settings[this] = settings[this] || settings.speed;
        });

        return this.each(
            function () {
                var elem = $(this), jspApi = elem.data('jsp');
                if (jspApi) {
                    jspApi.reinitialise(settings);
                } else {
                    $("script", elem).filter('[type="text/javascript"],:not([type])').remove();
                    jspApi = new JScrollPane(elem, settings);
                    elem.data('jsp', jspApi);
                }
            }
        );
    };

    $.fn.jScrollPane.defaults = {
        maintainPosition: true,
        stickToBottom: false,
        stickToRight: false,
        clickOnTrack: true,
        autoReinitialise: false,
        autoReinitialiseDelay: 500,
        verticalDragMinHeight: 0,
        verticalDragMaxHeight: 99999,
        horizontalDragMinWidth: 0,
        horizontalDragMaxWidth: 99999,
        contentWidth: undefined,
        animateScroll: false,
        animateDuration: 300,
        animateEase: 'linear',
        hijackInternalLinks: false,
        verticalGutter: 4,
        horizontalGutter: 4,
        mouseWheelSpeed: 3,
        trackClickSpeed: 0,
        trackClickRepeatFreq: 70,
        enableKeyboardNavigation: true,
        hideFocus: false,
        keyboardSpeed: 0,
        initialDelay: 300,
        speed: 30,
        scrollPagePercent: .8
    };

}));
