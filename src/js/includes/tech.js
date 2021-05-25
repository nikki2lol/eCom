export default function () {

  (function makeFixedHeader(){
    const header = document.querySelector('.header');
    if (!header){ return; }
    window.onload = () =>{
      document.addEventListener('scroll', onScroll);
    };
    const onScroll = ()=>{
      header.classList.toggle('header--pinned',window.pageYOffset > 0, window.pageYOffset <= 0);
    };
  })();

  (function makeTypeWritingEffect(){
      const array = document.querySelectorAll('.js-typewriting');

      if (!array) return;

      array.forEach((typeWritingBlock)=>{
        const staticBlock = typeWritingBlock.querySelector('.typewriting__static');
        const resultBlock = typeWritingBlock.querySelector('.typewriting__animate span');
        // console.log('innerHTML', staticBlock.innerHTML);
        // console.log('textContent', staticBlock.textContent);

        let textStroke = [];
        textStroke.push(staticBlock.textContent);

        function typeWriter(text, i, fnCallback) {
          if (i < (text.length)) {
            resultBlock.textContent = text.substring(0, i+1);

            setTimeout(function() {
              typeWriter(text, i + 1, fnCallback)
            }, 100);
          } else{
            return;
          }
        }
        function startTyping(i) {
          if (i < textStroke[i].length) {
            typeWriter(textStroke[i], 0, function(){
              startTyping(i + 1);
            });
          }
        }
        // start the text animation
        startTyping(0);

        // let words = staticBlock.textContent.split(' ');
        // console.log(words, 'words');
        // words.forEach((word, wordIndex)=>{
        //   // resultBlock.textContent = resultBlock.textContent + ' ' + word;
        //   let wordBlock = document.createElement('div');
        //   let letters = word.split('');
        //
        //   resultBlock.appendChild(wordBlock);
        //   letters.forEach((letter, index)=>{
        //     setTimeout(()=> {
        //       if (index == letters.length - 1){
        //         wordBlock.textContent = wordBlock.textContent + letter + ' ';
        //       } else {
        //         wordBlock.textContent = wordBlock.textContent + letter;
        //       }
        //     },100 * index);
        //   })
        // })
      })

  })();
}
