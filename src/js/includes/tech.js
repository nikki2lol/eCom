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
}
