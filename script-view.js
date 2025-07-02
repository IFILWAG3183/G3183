
fetch('log.json')
  .then(r => r.json())
  .then(data => {
    const container = document.getElementById('log-container');
    data.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerText = entry;
      container.appendChild(div);
    });
  });
