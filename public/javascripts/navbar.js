'use strict';

const main = () => {

   
  const toggleElement = document.querySelector('#menu-toggle');
  toggleElement.addEventListener('input', handleNavInput);

  function handleNavInput (event) {
    
    const inputElement = event.target.querySelector('input');
    const inputValue = inputElement.value;

    searchTortillas(inputValue);
  }
  }
};

window.addEventListener('load', main);