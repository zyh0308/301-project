'use strict';

$('.mb').hover(function () {
  $(this).css('transform', 'scale(1.1)');
}, function () {
  $(this).css('transform', 'scale(1)');
});

$('.activities').hover(function () {
  $(this).css('background-color', 'rgba(230, 228, 228, 0.25)');
}, function () {
  $(this).css('background-color', 'rgba(230, 228, 228, 0.07)');
});

$('.save').hover(function () {
  $(this).css('background-color', 'palevioletred');
}, function () {
  $(this).css('background-color', 'white');
});

