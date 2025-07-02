const input = document.getElementById('log-input');
const colorPicker = document.getElementById('color-picker');
const container = document.getElementById('log-container');
let logs = [];

function addLog() {
  const text = input.value.trim();
  if (!text) return;

  const dateTime = new Date().toLocaleString();
  const color = colorPicker.value;
  const entryText = `${dateTime} ${text}`;
  logs.push({ text: entryText, color });

  const div = document.createElement('div');
  div.className = 'entry';
  div.innerHTML = `<span style="color:${color}">${entryText}</span>`;
  container.appendChild(div);

  input.value = '';
  input.focus();

  saveToGitHub(); // 写入后自动保存
}

function exportLog() {
  if (logs.length === 0) {
    alert('没有日志内容可以导出。');
    return;
  }
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: 'application/json;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `日志_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function saveToGitHub() {
  const user = localStorage.getItem('gh-user');
  const repo = localStorage.getItem('gh-repo');
  const email = localStorage.getItem('gh-email');
  const token = localStorage.getItem('gh-token');

  if (!user || !repo || !email || !token) return;

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(logs))));
  const body = {
    message: `更新日志 ${new Date().toISOString()}`,
    committer: {
      name: user,
      email: email
    },
    content: content,
    sha: null
  };

  fetch(`https://api.github.com/repos/${user}/${repo}/contents/log.json`, {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.sha) body.sha = data.sha;
      return fetch(`https://api.github.com/repos/${user}/${repo}/contents/log.json`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(body)
      });
    })
    .then(res => res.json())
    .then(() => console.log('✅ 日志同步成功'))
    .catch(err => console.error('❌ 同步失败：', err));
}

function loadLogsFromGitHub() {
  const user = localStorage.getItem('gh-user');
  const repo = localStorage.getItem('gh-repo');
  const token = localStorage.getItem('gh-token');

  if (!user || !repo || !token) return;

  fetch(`https://api.github.com/repos/${user}/${repo}/contents/log.json`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  })
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      logs = data;
      logs.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.innerHTML = `<span style="color:${entry.color}">${entry.text}</span>`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error('❌ 加载失败：', err));
}

document.getElementById('add-btn').onclick = addLog;
document.getElementById('export-btn').onclick = exportLog;

loadLogsFromGitHub(); // 页面加载时读取远程日志
