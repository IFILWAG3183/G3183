
const input = document.getElementById('log-input');
const colorPicker = document.getElementById('colorPicker');
const container = document.getElementById('log-container');
const entries = JSON.parse(localStorage.getItem("logEntries") || "[]");

window.onload = function () {
  entries.forEach(entry => addToDOM(entry));
};

function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addLog() {
  const text = input.value.trim();
  if (!text) return;
  const now = new Date();
  const entry = {
    datetime: formatDateTime(now),
    text,
    color: colorPicker.value
  };
  entries.push(entry);
  localStorage.setItem("logEntries", JSON.stringify(entries));
  addToDOM(entry);
  input.value = '';
}

function addToDOM(entry) {
  const div = document.createElement('div');
  div.className = 'entry';
  div.innerHTML = `<span class="timestamp">${entry.datetime}</span><span style="color:${entry.color}">${entry.text}</span>`;
  container.appendChild(div);
}

function exportLog() {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "log.json";
  a.click();
  URL.revokeObjectURL(url);
}
