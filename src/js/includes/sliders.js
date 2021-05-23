import Swiper from 'swiper/bundle';

export default function(){
  // console.log('sliders.js connected');
  // const remRate = parseFloat(window.getComputedStyle(document.querySelector('html')).fontSize) / 16;

  (function initTeamSlider(){
    const sliderHolder = document.querySelector('.js-team-slider');

    if (!sliderHolder) return;

    const slider = sliderHolder.querySelector('.team__slider');
    const navPrev = sliderHolder.querySelector('.team__slider-nav--prev');
    const navNext = sliderHolder.querySelector('.team__slider-nav--next');
    const pagination = sliderHolder.querySelector('.team__slider-pagination');


    const sliderInstance = new Swiper(slider, {
      speed: 300,
      effect: 'fade',
      fadeEffect:{
        crossFade: true,
      },
      autoHeight: true,
      // touchRatio: 0,
      loop: true,
      navigation: {
        nextEl: navNext,
        prevEl: navPrev,
      },
      pagination: {
        type: 'bullets',
        el: pagination,
        bulletElement: 'div',
        bulletClass: 'team__slider-pag',
        bulletActiveClass: 'team__slider-pag--active',
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
      },
    });

  })();

}
