/* globals PP, QUnit */

'use strict';

var pluginName = 'wizard',
    className = 'wizard',
    namespace = 'pp-wizard';

// UNIT TESTS
QUnit.module('jQuery Wizard plugin');
QUnit.test('jquery plugin should exist', function(assert) {
    assert.equal(typeof jQuery.fn[pluginName], 'function');
});

QUnit.test('class of plugin should exist', function(assert) {
    assert.equal(typeof window.WizardPlugin, 'function');
});

QUnit.test('should have 3 slides', function(assert) {
    var instance = new window.WizardPlugin($('.' + className), {});
    assert.equal(instance.getSections().length, 3);
});

QUnit.test('should return proper active slide index', function(assert) {
    var instance = new window.WizardPlugin($('.' + className), {
        activeSlide: 3
    });
    assert.equal(instance.getActiveSlideIndex(), 3);
});

QUnit.test('navigation should\'ve been disabled', function(assert) {
    $('.' + className)[pluginName]({
        navigation: false
    });
    assert.equal($('.' + className).find('.' + namespace + '-navigation').length, 0);
});

QUnit.test('navigation should\'ve been enabled', function(assert) {
    $('.' + className)[pluginName]({
        navigation: true
    });
    assert.equal($('.' + className).find('.' + namespace + '-navigation').length, 1);
});


// DOM TESTS
QUnit.test('second slide should\'ve been shown', function(assert) {
    var activeSlide = 2;
    $('.' + className)[pluginName]({
        activeSlide: activeSlide
    });
    assert.ok( $('.wizard > section').eq(activeSlide - 1).is(':visible') );
});

QUnit.test('next button should trigger next slide', function(assert) {
    var instance = new window.WizardPlugin($('.' + className), {
        activeSlide: 1
    });

    assert.equal(instance.getActiveSlideIndex(), 1);
    $('.' + className + ' > section').filter(':visible').find('.' + namespace + '-button-next').trigger('click');
    assert.equal(instance.getActiveSlideIndex(), 2);
});

QUnit.test('navigation click should trigger proper slide', function(assert) {
    var instance = new window.WizardPlugin($('.' + className), {
        activeSlide: 1,
        navigation: true
    });
    $('.' + namespace + '-navigation > li').eq(1).trigger('click');
    assert.equal(instance.getActiveSlideIndex(), 2);
    $('.' + namespace + '-navigation > li').eq(0).trigger('click');
    assert.equal(instance.getActiveSlideIndex(), 1);
});