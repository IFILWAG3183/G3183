
const input = document.getElementById('log-input');
const container = document.getElementById('log-container');
const colorPicker = document.getElementById('colorPicker');
const repo = localStorage.getItem('gh-repo');
const user = localStorage.getItem('gh-user');
const token = localStorage.getItem('gh-token');
const email = localStorage.getItem('gh-email');
let logs = [];

function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function loadLogs() {
  fetch('log.json')
    .then(r => r.json())
    .then(data => {
      logs = data;
      data.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerText = entry;
        container.appendChild(div);
      });
    });
}

function addLog() {
  const text = input.value.trim();
  if (!text) return;
  const time = formatDateTime(new Date());
  const entry = `${time} ${text}`;
  logs.push(entry);

  const div = document.createElement('div');
  div.className = 'entry';
  div.innerHTML = `<span style="color:${colorPicker.value}">${entry}</span>`;
  container.appendChild(div);
  input.value = '';

  const content = JSON.stringify(logs, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(content)));
  fetch(`https://api.github.com/repos/${user}/${repo}/contents/log.json`, {
    method: "PUT",
    headers: {
      "Authorization": "token " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "update log",
      content: encoded,
      sha: null
    })
  }).then(res => res.json()).then(resp => {
    if (resp.commit) console.log("日志已保存");
    else console.error("失败", resp);
  });
}

function exportLog() {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'log.json';
  a.click();
}
window.onload = loadLogs;
