module.exports = (function () {

    function scrollElementToTop(element, offset, duration) {

        if (duration <= 0) return;

        let
            difference = element.getBoundingClientRect().top + offset,
            perTick = difference / duration * 10;

        setTimeout(function () {

            window.pageYOffset = window.pageYOffset + perTick;
            document.documentElement.scrollTop = document.documentElement.scrollTop + perTick;
            document.body.scrollTop = document.body.scrollTop + perTick;

            if (element.getBoundingClientRect().top === offset) return;

            scrollElementToTop(element, offset, duration - 10);

        }, 10);
    }

    function scrollElement(element, to, duration) {
        if (duration <= 0) return;
        let difference = to - element.scrollTop,
            perTick = difference / duration * 10;
        setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) return;
            scrollElement(element, to, duration - 10);
        }, 10);
    }

    function scrollBody(to, duration) {

        if (duration <= 0) return;

        let
            difference = to - Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop),
            perTick = difference / duration * 10;

        setTimeout(function () {
            let scroll = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + perTick;
            window.pageYOffset = scroll;
            document.documentElement.scrollTop = scroll;
            document.body.scrollTop = scroll;
            if (scroll === to) return;
            scrollBody(to, duration - 10);

        }, 10);
    }

    function addClass(elements, myClass) {
        if (!elements) return;

        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        } else if (elements.tagName) {
            elements = [elements];
        }

        // add class to all chosen elements
        for (let i = 0; i < elements.length; i++) {
            if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) elements[i].className += ' ' + myClass;
        }
    }

    function removeClass(elements, myClass) {
        if (!elements) return;

        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        } else if (elements.tagName) {
            elements = [elements];
        }

        // create pattern to find class name
        let reg = new RegExp('(^| )' + myClass + '($| )', 'g');

        // remove class from all chosen elements
        for (let i = 0; i < elements.length; i++) {
            elements[i].className = elements[i].className.replace(reg, ' ');
        }
    }

    function toggleClass(elements, myClass) {
        if (!elements) return;

        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        } else if (elements.tagName) {
            elements = [elements];
        }

        // create pattern to find class name
        let reg = new RegExp('(^| )' + myClass + '($| )', 'g');

        for (let i = 0; i < elements.length; i++) {
            if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') > 0) {
                elements[i].className = elements[i].className.replace(reg, ' ');
            } else {
                elements[i].className += ' ' + myClass;
            }
        }
    }

    function hasClass(elements, myClass) {
        if (!elements) return;

        // if we have a selector, get the chosen elements
        if (typeof(elements) === 'string') {
            elements = document.querySelectorAll(elements);
        } else if (elements.tagName) {
            elements = [elements];
        }

        // add class to all chosen elements
        let n = 0;
        for (let i = 0; i < elements.length; i++) {
            if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') > 0) n++;
        }

        return n === elements.length;
    }

    function indexInParent(node) {
        let children = node.parentNode.childNodes,
            num = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i] === node) return num;
            if (children[i].nodeType === 1) num++;
        }
        return -1;
    }

    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                func.apply(this, arguments);
            }, wait);
        };
    }

    function scrolly (el) {

        let
            content = el.querySelector('.content'),
            path = el.querySelector('.scrollbar_container'),
            scrollBar = el.querySelector('.scrollbar'),
            scrollEvent = new Event('scroll');
    
        content.addEventListener('scroll', function () {
            scrollBar.style.height = path.clientHeight * content.clientHeight / content.scrollHeight + 'px';
            scrollBar.style.top = path.clientHeight * content.scrollTop / content.scrollHeight + 'px';
        });
    
        window.addEventListener('resize', content.dispatchEvent.bind(content, scrollEvent));
        content.dispatchEvent(scrollEvent);
    
        scrollBar.addEventListener('mousedown', function (eDown) {
            eDown.preventDefault();
            let scrollBar_offsetTop = scrollBar.offsetTop,
                eDown_pageY = eDown.pageY,
                onMove = function (eMove) {
                    scrollBar.style.top = Math.min(
                        path.clientHeight - scrollBar.clientHeight,
                        Math.max(
                            0,
                            scrollBar_offsetTop + eMove.pageY - eDown_pageY
                        )
                    ) + 'px';
                    content.scrollTop = (content.scrollHeight * scrollBar.offsetTop / path.clientHeight);
                };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', function () {
                document.removeEventListener('mousemove', onMove);
            });
        });
    
    };

    return {
        scrolly: scrolly,
        scrollElementToTop: scrollElementToTop,
        scrollElement: scrollElement,
        scrollBody: scrollBody,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        hasClass: hasClass,
        indexInParent: indexInParent,
        debounce: debounce
    };

})();