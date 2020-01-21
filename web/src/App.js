import React, { useState } from 'react';

// 3 Conceitos principais do React:
// Componente : Função que retorna algum conteúdo, por exemplo: html, css, javascript, etc...
//              É um bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.
// Propriedade: Informações que o componente PAI passa para o componente FILHO.
// Estado     : Informações mantidas pelo componente (Lembrar: Imutabilidade).

//import Header from './Header';

function App() {
  const [counter, setCounter] = useState(0);

  function incrementCounter() {
    setCounter(counter + 1);
  }

  return (
    <>
      <h1>Contador: {counter}</h1>
      <button onClick={incrementCounter}>Incrementar</button>
    </>
  );
};

export default App;