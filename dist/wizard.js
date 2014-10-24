/*!
 * wizard.js
 * Original author: Miro Koczka
 * Version 0.1
 * Date: 2014-10-08
 */

/* global jQuery, window */
(function($, window) {

    'use strict';

    window.WizardPlugin = window.WizardPlugin || {};

    var pluginName = 'wizard',
        defaults = {
            // TODO: catch invalid input
            // TODO: add option to set custom navigation title
            activeSlide: 1,
            namespace: 'pp-wizard',
            navigation: true,
            navigationNumbers: true,
            // TODO: add option to add buttons automatically
            buttons: true,
            lockedSteps: true,
            animationTime: 200
        };

    function Plugin(element, options) {
        this.options = $.extend({}, defaults, options);

        this.element = element;
        this.$element = $(element);
        this.$sections = null;
        this.$navigation = null;

        this.namespace = this.options.namespace;
        this.className = '.' + this.namespace;

        //this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function() {
        this.$sections = this.getSections().hide();
        this.slideIndex = this.options.activeSlide - 1;

        if (this.options.navigation) {
            this.initNavigation();
        }

        this.processSlide(this.slideIndex);

        this.initSlideEvents();
    };

    Plugin.prototype.initNavigation = function() {
        this.$navigation = $('<ul />').addClass(this.options.namespace + '-navigation');
        this.insertNavigation();
        this.initNavigationEvents();
    };

    Plugin.prototype.getActiveSlideIndex = function() {
        return this.$element.find('.' + this.options.namespace + '-show').index();
    };

    Plugin.prototype.getSections = function() {
        return this.$element.children('section');
    };

    Plugin.prototype.processSlide = function(slideIndex) {
        var slides = {
            originalHeight: this.$element.outerHeight(),
            previous: this.$element.find(this.className + '-show'),
            current: this.$sections.eq(slideIndex)
        };
        if (this.$navigation) {
            var navigation = {
                previous: this.$navigation.find(this.className + '-active'),
                current: this.$navigation.children('li').eq(slideIndex),
                next: this.$navigation.children('li').eq(slideIndex + 1)
            };
            this.toggleNavigationItem(slideIndex, navigation);
        }
        this.toggleSlideItem(slideIndex, slides);
        this.setWizardHeight(slides);
        this.animateSlide(slides);
        this.activeSlide = slideIndex;
    };

    // events
    Plugin.prototype.initSlideEvents = function() {
        var self = this;
        // TODO: prev button
        this.$sections.find('.' + this.options.namespace + '-button-next').on('click', function() {
            self.processSlide(self.activeSlide + 1);
        });
    };

    Plugin.prototype.initNavigationEvents = function() {
        var self = this;
        this.$navigation.on('click', 'li', function() {
            var $this = $(this);
            if (!$this.hasClass(self.namespace + '-disabled') && !$this.hasClass(self.namespace + '-active')) {
                self.processSlide($(this).index());
            }
        });
    };

    // DOM Methods
    Plugin.prototype.insertNavigation = function() {
        var self = this,
            items = '',
            number = '';

        // TODO: refactor, simplify
        this.$sections.each(function(index, item) {
            var $item = $(item),
                activeClass = $item.index() === self.slideIndex ? self.options.namespace + '-active' : '',
                disabledClass = '';
            if (self.options.lockedSteps && $item.index() !== self.slideIndex && $item.index() !== self.slideIndex + 1) {
                disabledClass = self.options.namespace + '-disabled';
            }
            if (self.options.navigationNumbers) {
                number = '<span class="' + self.options.namespace + '-number">' + ($item.index() + 1 ) + '</span> ';
            }
            // TODO: remove custom span
            items += '<li class="' + activeClass + ' ' + disabledClass + '">' + number + $item.attr('title') + '<span class="pp-wizard-nav-img"></span></li>';
        });

        this.$element.prepend(this.$navigation.html(items));
    };

    Plugin.prototype.toggleNavigationItem = function(slideIndex, navigation) {
        var activeClass = this.namespace + '-active',
            selectedClass = this.namespace + '-was-selected',
            disabledClass = this.namespace + '-disabled';
        this.$navigation.children('li').removeClass(activeClass);
        navigation.previous.addClass(selectedClass);
        navigation.current.addClass(activeClass);
        navigation.next.removeClass(disabledClass);
    };

    Plugin.prototype.toggleSlideItem = function(slideIndex, slides) {
        this.$sections.removeClass(this.namespace + '-show').addClass(this.namespace + '-hide');
        slides.current.addClass(this.namespace + '-show').removeClass(this.namespace + '-hide');
    };

    Plugin.prototype.setWizardHeight = function(slides) {
        this.$element.css('height', 'auto');
        // TODO: remove magic constant
        var height = this.$navigation !== null ? this.$element.outerHeight() : this.$element.outerHeight() + 80;
        this.$element.css('height', slides.originalHeight);
        this.$element.animate({height: height + slides.current.outerHeight()}, this.options.animationTime);
    };

    Plugin.prototype.animateSlide = function(slides) {
        if (slides.previous.index() > slides.current.index()) {
            slides.current.show(0).css('left', '-100%');
            slides.previous.css('left', '100%').delay(200).hide(0);
            slides.current.css('left', '0%');
        } else {
            slides.current.show(0).css('left', '100%');
            slides.previous.css('left', '-100%').delay(200).hide(0);
            slides.current.css('left', '0%');
        }
    };

    window.WizardPlugin = Plugin;

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };

})(jQuery, window);