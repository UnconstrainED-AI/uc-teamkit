import http from "http";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = 3456;

function parseIdentity(md) {
  const sections = {};
  let current = null;
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      current = line.replace("## ", "").trim();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  // Parse specific fields
  const basics = (sections["Basics"] || []).join("\n");
  const nameMatch = basics.match(/\*\*Name:\*\*\s*(.+)/);
  const emojiMatch = basics.match(/\*\*Emoji:\*\*\s*(.+)/);

  return {
    name: nameMatch ? nameMatch[1].trim() : "Your Assistant",
    emoji: emojiMatch ? emojiMatch[1].trim() : "",
    personality: (sections["Personality"] || []).join("\n").trim(),
    voice: (sections["Voice & Communication Style"] || []).join("\n").trim(),
    focus: (sections["Focus Areas"] || []).join("\n").trim(),
    user: (sections["What To Call You"] || []).join("\n").trim(),
    quirks: (sections["Quirks"] || []).join("\n").trim(),
  };
}

function parseSoul(md) {
  const sections = {};
  let current = null;
  for (const line of md.split("\n")) {
    if (line.startsWith("## ")) {
      current = line.replace("## ", "").trim();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return {
    rules: (sections["Communication Rules"] || []).join("\n").trim(),
    boundaries: (sections["Boundaries"] || []).join("\n").trim(),
    success: (sections["What Success Looks Like"] || []).join("\n").trim(),
    annoyances: (sections["Things That Annoy Me"] || []).join("\n").trim(),
  };
}

function buildPage(identity, soul, raw) {
  const i = identity;
  const s = soul;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${i.name} ${i.emoji} — Assistant Profile</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0d0d0d; color: #e0e0e0; min-height: 100vh; }
  .container { max-width: 720px; margin: 0 auto; padding: 32px 20px; }
  .header { text-align: center; margin-bottom: 40px; }
  .emoji-big { font-size: 64px; display: block; margin-bottom: 8px; }
  .name { font-size: 32px; font-weight: 700; color: #f5a623; }
  .subtitle { color: #888; font-size: 14px; margin-top: 4px; }
  .card { background: #1a1a1a; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #2a2a2a; }
  .card:hover { border-color: #f5a623; }
  .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #f5a623; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
  .edit-btn { background: none; border: 1px solid #444; color: #888; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; }
  .edit-btn:hover { border-color: #f5a623; color: #f5a623; }
  .card-content { font-size: 15px; line-height: 1.6; white-space: pre-wrap; color: #ccc; }
  .card-content.editing { display: none; }
  textarea.editor { width: 100%; min-height: 120px; background: #111; color: #e0e0e0; border: 1px solid #f5a623; border-radius: 8px; padding: 12px; font-family: inherit; font-size: 14px; line-height: 1.5; resize: vertical; display: none; }
  textarea.editor.active { display: block; }
  .save-btn { background: #f5a623; color: #000; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 8px; display: none; }
  .save-btn.active { display: inline-block; }
  .save-btn:hover { background: #e69500; }
  .saved-msg { color: #4caf50; font-size: 13px; margin-left: 12px; display: none; }
  .saved-msg.show { display: inline; }
  .section-divider { border: none; border-top: 1px solid #222; margin: 32px 0; }
  .section-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  .footer { text-align: center; padding: 32px 0; color: #444; font-size: 13px; }
  .footer a { color: #f5a623; text-decoration: none; }
  .checklist { list-style: none; }
  .checklist li { padding: 2px 0; }
  .tag { display: inline-block; background: #2a2a2a; border: 1px solid #333; border-radius: 4px; padding: 2px 8px; margin: 2px; font-size: 13px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <span class="emoji-big">${i.emoji}</span>
    <div class="name">${i.name}</div>
    <div class="subtitle">Your Personal AI Assistant</div>
  </div>

  <div class="card" data-section="personality" data-file="identity">
    <div class="card-title">Personality <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(i.personality)}</div>
    <textarea class="editor">${escapeHtml(i.personality)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="card" data-section="voice" data-file="identity">
    <div class="card-title">Voice & Communication Style <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(i.voice)}</div>
    <textarea class="editor">${escapeHtml(i.voice)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="card" data-section="focus" data-file="identity">
    <div class="card-title">Focus Areas <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(i.focus)}</div>
    <textarea class="editor">${escapeHtml(i.focus)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="card" data-section="quirks" data-file="identity">
    <div class="card-title">Quirks <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(i.quirks) || "(none yet — add some!)"}</div>
    <textarea class="editor">${escapeHtml(i.quirks)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <hr class="section-divider">
  <div class="section-label">Values & Rules</div>

  <div class="card" data-section="boundaries" data-file="soul">
    <div class="card-title">Boundaries <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(s.boundaries)}</div>
    <textarea class="editor">${escapeHtml(s.boundaries)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="card" data-section="success" data-file="soul">
    <div class="card-title">What Success Looks Like <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(s.success)}</div>
    <textarea class="editor">${escapeHtml(s.success)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="card" data-section="annoyances" data-file="soul">
    <div class="card-title">Things That Annoy Me <button class="edit-btn" onclick="toggleEdit(this)">Edit</button></div>
    <div class="card-content">${escapeHtml(s.annoyances)}</div>
    <textarea class="editor">${escapeHtml(s.annoyances)}</textarea>
    <button class="save-btn" onclick="save(this)">Save</button>
    <span class="saved-msg">Saved!</span>
  </div>

  <div class="footer">
    <a href="#" onclick="location.reload()">Refresh</a> &middot; Changes saved to your local files &middot; Restart Claude Code to apply
  </div>
</div>

<script>
function escapeForDisplay(text) { return text; }

function toggleEdit(btn) {
  const card = btn.closest('.card');
  const content = card.querySelector('.card-content');
  const editor = card.querySelector('.editor');
  const saveBtn = card.querySelector('.save-btn');
  const isEditing = editor.classList.contains('active');

  if (isEditing) {
    content.textContent = editor.value;
    content.classList.remove('editing');
    editor.classList.remove('active');
    saveBtn.classList.remove('active');
    btn.textContent = 'Edit';
  } else {
    content.classList.add('editing');
    editor.classList.add('active');
    saveBtn.classList.add('active');
    editor.focus();
    btn.textContent = 'Cancel';
  }
}

async function save(btn) {
  const card = btn.closest('.card');
  const section = card.dataset.section;
  const file = card.dataset.file;
  const editor = card.querySelector('.editor');
  const content = card.querySelector('.card-content');
  const savedMsg = card.querySelector('.saved-msg');
  const editBtn = card.querySelector('.edit-btn');

  const resp = await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, file, value: editor.value })
  });

  if (resp.ok) {
    content.textContent = editor.value;
    content.classList.remove('editing');
    editor.classList.remove('active');
    btn.classList.remove('active');
    editBtn.textContent = 'Edit';
    savedMsg.classList.add('show');
    setTimeout(() => savedMsg.classList.remove('show'), 2000);
  }
}
</script>
</body>
</html>`;
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Section-to-markdown mapping for saving
function updateMarkdownSection(md, sectionName, newContent) {
  const lines = md.split("\n");
  const result = [];
  let inTarget = false;
  let found = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## " + sectionName)) {
      inTarget = true;
      found = true;
      result.push(lines[i]);
      result.push("");
      result.push(newContent);
      continue;
    }
    if (inTarget && lines[i].startsWith("## ")) {
      inTarget = false;
      result.push("");
      result.push(lines[i]);
      continue;
    }
    if (!inTarget) {
      result.push(lines[i]);
    }
  }

  if (!found) {
    result.push("");
    result.push("## " + sectionName);
    result.push("");
    result.push(newContent);
  }

  return result.join("\n");
}

const SECTION_MAP = {
  personality: { file: "my-identity.md", heading: "Personality" },
  voice: { file: "my-identity.md", heading: "Voice & Communication Style" },
  focus: { file: "my-identity.md", heading: "Focus Areas" },
  quirks: { file: "my-identity.md", heading: "Quirks" },
  boundaries: { file: "my-soul.md", heading: "Boundaries" },
  success: { file: "my-soul.md", heading: "What Success Looks Like" },
  annoyances: { file: "my-soul.md", heading: "Things That Annoy Me" },
};

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    try {
      const identityMd = await fs.readFile(path.join(ROOT, "my-identity.md"), "utf-8");
      const soulMd = await fs.readFile(path.join(ROOT, "my-soul.md"), "utf-8");
      const identity = parseIdentity(identityMd);
      const soul = parseSoul(soulMd);
      const html = buildPage(identity, soul, { identityMd, soulMd });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading profile: " + err.message + "\n\nMake sure you've run 'npm run setup' first.");
    }
    return;
  }

  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { section, value } = JSON.parse(body);
        const mapping = SECTION_MAP[section];
        if (!mapping) {
          res.writeHead(400);
          res.end("Unknown section");
          return;
        }

        const filePath = path.join(ROOT, mapping.file);
        let md = await fs.readFile(filePath, "utf-8");
        md = updateMarkdownSection(md, mapping.heading, value);
        await fs.writeFile(filePath, md);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(500);
        res.end("Save failed: " + err.message);
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n  Assistant profile: ${url}\n`);

  // Auto-open browser
  const openCmd =
    process.platform === "darwin" ? "open" :
    process.platform === "win32" ? "start" : "xdg-open";
  exec(`${openCmd} ${url}`);
});
