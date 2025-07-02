function getConfig() {
  return {
    token: localStorage.getItem("gh-token"),
    username: localStorage.getItem("gh-user"),
    repo: localStorage.getItem("gh-repo"),
    email: localStorage.getItem("gh-email")
  };
}

async function addLog() {
  const input = document.getElementById('log-input');
  const color = document.getElementById('colorPicker').value;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timestamp = now.toISOString().replace("T", " ").slice(0, 16);
  const entry = { timestamp, text, color };

  const config = getConfig();
  const apiUrl = `https://api.github.com/repos/${config.username}/${config.repo}/contents/log.json`;

  let logs = [];
  let sha = "";

  // 获取原始文件
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `token ${config.token}` }
    });
    const data = await res.json();
    logs = JSON.parse(atob(data.content));
    sha = data.sha;
  } catch (e) {
    logs = [];
  }

  logs.push(entry);
  const body = {
    message: "update log",
    committer: { name: config.username, email: config.email },
    content: btoa(JSON.stringify(logs, null, 2)),
    sha: sha || undefined
  };

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("已上传！");
    input.value = '';
  } else {
    alert("上传失败");
  }
}
