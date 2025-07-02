
fetch('log.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('log-container');
    data.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = `<span class="timestamp">${entry.datetime}</span><span style="color:${entry.color}">${entry.text}</span>`;
      container.appendChild(div);
    });
  });
