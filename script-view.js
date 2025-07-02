fetch("https://raw.githubusercontent.com/IFILWAG3183/G3183/main/log.json")
  .then(res => res.json())
  .then(logs => {
    const container = document.getElementById("log-container");
    container.innerHTML = "";
    logs.forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `<span style="color:${entry.color}">[${entry.timestamp}] ${entry.text}</span>`;
      container.appendChild(div);
    });
  });
