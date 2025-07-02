
fetch('log.json')
  .then(res => res.json())
  .then(logs => {
    const container = document.getElementById('log-container');
    logs.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerText = entry;
      container.appendChild(div);
    });
  });
