"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhongliChatPanel = void 0;
/**
 * 钟离 Webview 侧边栏面板
 */
const crypto = __importStar(require("crypto"));
function getNonce() {
    return crypto.randomBytes(16).toString('hex');
}
class ZhongliChatPanel {
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
        this.messages = [];
    }
    setOnUserMessage(handler) {
        this.onUserMessage = handler;
    }
    resolveWebviewView(webviewView, _context, _token) {
        this.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri],
        };
        webviewView.webview.html = this.getHtml();
        webviewView.webview.onDidReceiveMessage((data) => {
            if (data.type === 'userMessage' && typeof data.text === 'string') {
                const trimmed = data.text.trim();
                if (trimmed && trimmed.length <= 500) {
                    this.messages.push({ from: 'user', text: trimmed });
                    this.trimMessages();
                    this.syncMessages();
                    this.onUserMessage?.(trimmed);
                }
            }
        });
        this.syncMessages();
    }
    addBotMessage(text) {
        this.messages.push({ from: 'zhongli', text });
        this.trimMessages();
        this.syncMessages();
    }
    updateStats(stats) {
        this.latestStats = stats;
        if (this.view) {
            this.view.webview.postMessage({
                type: 'updateStats',
                stats,
            });
        }
    }
    trimMessages() {
        const MAX_MESSAGES = 200;
        if (this.messages.length > MAX_MESSAGES) {
            this.messages = this.messages.slice(this.messages.length - MAX_MESSAGES);
        }
    }
    syncMessages() {
        if (!this.view) {
            return;
        }
        this.view.webview.postMessage({
            type: 'messages',
            messages: this.messages,
        });
        if (this.latestStats) {
            this.view.webview.postMessage({
                type: 'updateStats',
                stats: this.latestStats,
            });
        }
    }
    getHtml() {
        const nonce = getNonce();
        return /*html*/ `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <title>钟离的书斋</title>
  <style nonce="${nonce}">
    :root {
      --geo-amber: #C6A14B;
      --geo-gold: #FFD54F;
      --geo-bg: var(--vscode-editor-background, #1e1e2e);
      --geo-fg: var(--vscode-editor-foreground, #cdd6f4);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family, 'Segoe UI', sans-serif);
      background: var(--geo-bg);
      color: var(--geo-fg);
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--geo-amber);
      text-align: center;
      font-size: 14px;
      color: var(--geo-amber);
      font-weight: 600;
    }
    .header span {
      color: var(--geo-gold);
      font-size: 12px;
      display: block;
      margin-top: 2px;
    }
    .stats-bar {
      display: flex;
      justify-content: space-around;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(198, 161, 75, 0.15);
      font-size: 11px;
      color: rgba(205, 214, 244, 0.7);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--geo-gold);
    }
    #chat {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .msg {
      max-width: 90%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      animation: fadeIn 0.3s ease;
      word-wrap: break-word;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .msg .avatar {
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
    }
    .msg .bubble { flex: 1; min-width: 0; }
    .msg .name {
      font-size: 11px;
      margin-bottom: 4px;
      font-weight: 600;
    }
    .msg.zhongli {
      align-self: flex-start;
      background: rgba(198, 161, 75, 0.1);
      border: 1px solid rgba(198, 161, 75, 0.25);
      color: var(--geo-fg);
    }
    .msg.zhongli .name { color: var(--geo-amber); }
    .msg.zhongli .avatar { background: rgba(198, 161, 75, 0.2); }
    .msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
      background: rgba(255, 213, 79, 0.1);
      border: 1px solid rgba(255, 213, 79, 0.2);
    }
    .msg.user .name { color: var(--geo-gold); text-align: right; }
    .msg.user .avatar { background: rgba(255, 213, 79, 0.2); }
    .typing-cursor {
      display: inline-block;
      width: 2px;
      height: 14px;
      background: var(--geo-amber);
      margin-left: 2px;
      animation: blink 0.6s infinite;
      vertical-align: text-bottom;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .input-area {
      display: flex;
      padding: 8px 12px;
      gap: 8px;
      border-top: 1px solid rgba(198, 161, 75, 0.2);
    }
    #userInput {
      flex: 1;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(198, 161, 75, 0.3);
      color: var(--geo-fg);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      outline: none;
    }
    #userInput:focus { border-color: var(--geo-amber); }
    #sendBtn {
      background: var(--geo-amber);
      color: #1e1e2e;
      border: none;
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 600;
    }
    #sendBtn:hover { opacity: 0.85; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="header">
    🪨 钟离的书斋
    <span>契约陪伴 · 番茄钟 · 品茶论道</span>
  </div>
  <div class="stats-bar">
    <div class="stat-item"><span class="stat-value" id="statPomodoro">0</span><span>🍵 番茄</span></div>
    <div class="stat-item"><span class="stat-value" id="statMsg">0</span><span>💬 对话</span></div>
  </div>
  <div id="chat"></div>
  <div class="input-area">
    <input id="userInput" type="text" placeholder="与钟离言说…" maxlength="500" />
    <button id="sendBtn">发送</button>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const chat = document.getElementById('chat');
    const input = document.getElementById('userInput');
    const btn = document.getElementById('sendBtn');

    let renderedCount = 0;
    let typeQueue = [];
    let isTyping = false;

    function send() {
      var t = input.value.trim();
      if (!t) return;
      vscode.postMessage({ type: 'userMessage', text: t });
      input.value = '';
    }
    btn.addEventListener('click', send);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') send();
    });

    window.addEventListener('message', function(e) {
      var msg = e.data;
      if (msg.type === 'messages') renderAll(msg.messages);
      if (msg.type === 'updateStats') updateStats(msg.stats);
    });

    function updateStats(s) {
      var sp = document.getElementById('statPomodoro');
      var sm = document.getElementById('statMsg');
      if (sp) { sp.textContent = s.pomodorosCompleted || 0; }
      if (sm) { sm.textContent = s.messagesCount || 0; }
    }

    function renderAll(msgs) {
      for (var i = renderedCount; i < msgs.length; i++) {
        var m = msgs[i];
        var div = document.createElement('div');
        div.className = 'msg ' + m.from;

        var avatar = document.createElement('span');
        avatar.className = 'avatar';
        avatar.textContent = m.from === 'zhongli' ? '🪨' : '⚔️';

        var bubble = document.createElement('div');
        bubble.className = 'bubble';

        var name = document.createElement('div');
        name.className = 'name';
        name.textContent = m.from === 'zhongli' ? '钟离' : '旅行者';
        bubble.appendChild(name);

        var content = document.createElement('span');
        content.className = 'content';
        bubble.appendChild(content);

        div.appendChild(avatar);
        div.appendChild(bubble);
        chat.appendChild(div);

        if (m.from === 'zhongli') {
          enqueueType(content, m.text);
        } else {
          content.textContent = m.text;
        }
      }
      renderedCount = msgs.length;
      chat.scrollTop = chat.scrollHeight;
    }

    function enqueueType(el, text) {
      typeQueue.push({ el: el, text: text });
      if (!isTyping) processQueue();
    }

    function processQueue() {
      if (typeQueue.length === 0) { isTyping = false; return; }
      isTyping = true;
      var job = typeQueue.shift();
      typeText(job.el, job.text, function() { processQueue(); });
    }

    function typeText(el, text, cb) {
      var idx = 0;
      var speed = text.length > 60 ? 20 : text.length > 30 ? 30 : 45;
      var cur = document.createElement('span');
      cur.className = 'typing-cursor';
      el.appendChild(cur);
      var timer = setInterval(function() {
        if (idx < text.length) {
          el.insertBefore(document.createTextNode(text[idx]), cur);
          idx++;
          chat.scrollTop = chat.scrollHeight;
        } else {
          clearInterval(timer);
          if (cur.parentNode) cur.parentNode.removeChild(cur);
          if (cb) cb();
        }
      }, speed);
    }
  </script>
</body>
</html>`;
    }
}
exports.ZhongliChatPanel = ZhongliChatPanel;
ZhongliChatPanel.viewType = 'zhongli.chatPanel';
//# sourceMappingURL=chatPanel.js.map