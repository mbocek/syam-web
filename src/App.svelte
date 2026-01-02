<script>
  let count = $state(0);
  
  function increment() {
    count += 1;
  }
</script>

<main>
  <h1>Svelte 5 + Vite + ECMA 2025</h1>
  <p>This is a basic setup using plain CSS and modern JavaScript.</p>
  
  <button onclick={increment}>
    Count is {count}
  </button>
</main>

<style>
  main {
    text-align: center;
    padding: 2em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 3em;
    font-weight: 100;
  }

  button {
    font-family: inherit;
    font-size: inherit;
    padding: 0.5em 1em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border: 1px solid rgba(255, 62, 0, 0.5);
    border-radius: 4px;
    cursor: pointer;
    outline: none;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
