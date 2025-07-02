const input = document.getElementById('log-input');
const container = document.getElementById('log-container');
const colorPicker = document.getElementById('colorPicker');
const logs = [];

function formatDateTime(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addLog() {
  const text = input.value.trim();
  if (!text) return;
  const now = new Date();
  const dateTime = formatDateTime(now);
  const color = colorPicker.value;
  const entryText = `${dateTime} ${text}`;
  logs.push(entryText);

  const div = document.createElement('div');
  div.className = 'entry';
  div.innerHTML = `<span style="color:${color}">${entryText}</span>`;
  container.appendChild(div);

  input.value = '';
  input.focus();
}

function exportLog() {
  if (logs.length === 0) {
    alert('没有日志内容可以导出。');
    return;
  }
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `日志_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}