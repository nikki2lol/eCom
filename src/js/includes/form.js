import Inputmask from 'inputmask';

export default function () {

  (function makeFormValidity(){
      const form = document.querySelector('.form');

      if (!form) return;

      const submitButton = form.querySelector('.js-submit-btn');
      const inputsArray = form.querySelectorAll('input[required]');
      const correctClass = 'form__input-holder--correct';
      const wrongClass = 'form__input-holder--wrong';
      const successPopup = document.querySelector('.js-success-popup');

      let checkFlag = false;

      submitButton.addEventListener('click',(evt)=>{
        inputsArray.forEach((input)=>{
          if (input.type == 'checkbox'){
            if (!input.checked){
              evt.preventDefault();
              let inputParEl = input.parentElement;
              inputParEl.classList.add('form__submit-checkbox--wrong');
              setTimeout(()=>{
                inputParEl.classList.remove('form__submit-checkbox--wrong');
              },1500);
            }
          } else {
            let parentEl = input.closest('.form__input-holder');
            if (input.value.length == 0){
              evt.preventDefault();
              parentEl.classList.add(wrongClass);
            } else {
              parentEl.classList.add(correctClass);
            }
          }
        })

      });

      form.addEventListener('submit',(evt)=>{
        evt.preventDefault();
        successPopup.classList.add('visible');
      });

      inputsArray.forEach((input)=>{
        if (input.type !== 'checkbox') {
          input.addEventListener('input',()=>{
            input.closest('.form__input-holder').classList.remove(correctClass);
            input.closest('.form__input-holder').classList.remove(wrongClass);
          })
        }
      })

    successPopup.querySelector('.contacts__popup-close').addEventListener('click',()=>{
      successPopup.classList.remove('visible');
    })

  })();


  (function createInputMask() {
    const telInputsArray = document.querySelectorAll('input[type="tel"]');

    if (!telInputsArray) return;

    telInputsArray.forEach((input) => {
      let im = new Inputmask("8 (999) 999 99 99",{
        showMaskOnHover: false
      });
      im.mask(input);
    })
  })();

  (function makeFormPlaceholders(){
      const inputsArray = document.querySelectorAll('.form__input-holder');

      if (!inputsArray) return;

      inputsArray.forEach((inputHolder)=>{
        if (inputHolder.classList.contains('form__input-holder--textarea')){
          let textarea = inputHolder.querySelector('textarea');

          textarea.addEventListener('focus',()=>{
            textarea.classList.add('focus');
          })
          textarea.addEventListener('blur',()=>{
            if (textarea.value.length == 0) {
              textarea.classList.remove('focus');
            }
          })
        } else{
          let inputs = inputHolder.querySelectorAll('input');
          inputs.forEach((input)=>{
            input.addEventListener('focus',()=>{
              input.classList.add('focus');
            });
            input.addEventListener('blur',()=>{
              if (input.value.length == 0) {
                input.classList.remove('focus');
              }
            });
          })
        }
      })
  })();

}
