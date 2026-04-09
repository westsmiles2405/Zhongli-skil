"use strict";
/**
 * 钟离工作陪伴 — 主入口
 */
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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const chatPanel_1 = require("./chatPanel");
const dynamicReply_1 = require("./dynamicReply");
const idleWatcher_1 = require("./idleWatcher");
const persona_1 = require("./persona");
const pomodoro_1 = require("./pomodoro");
const stats_1 = require("./stats");
function activate(context) {
    const panel = new chatPanel_1.ZhongliChatPanel(context.extensionUri);
    const pomodoro = new pomodoro_1.PomodoroTimer();
    const stats = new stats_1.StatsManager(context.workspaceState);
    // ── Webview 注册 ──────────────────────────────
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(chatPanel_1.ZhongliChatPanel.viewType, panel));
    // ── 聊天回调 ──────────────────────────────────
    panel.setOnUserMessage((text) => {
        stats.addMessage();
        if (dynamicReply_1.CODE_ANALYSIS_KEYWORDS.some((k) => text.includes(k))) {
            panel.addBotMessage((0, dynamicReply_1.analyzeCodeProblems)());
        }
        else {
            panel.addBotMessage((0, dynamicReply_1.generateResponse)(text));
        }
        panel.updateStats(stats.current);
    });
    // ── 闲置提醒 ──────────────────────────────────
    const idle = new idleWatcher_1.IdleWatcher(() => {
        panel.addBotMessage((0, persona_1.getTimeBasedGreeting)());
    });
    // ── 番茄钟回调 ────────────────────────────────
    function onPomodoroPhase(phase) {
        switch (phase) {
            case 'focus-end':
                stats.addPomodoro();
                panel.addBotMessage((0, persona_1.getFocusEnd)());
                panel.updateStats(stats.current);
                break;
            case 'break-start':
                panel.addBotMessage((0, persona_1.getBreakRemind)());
                break;
            case 'break-end':
                panel.addBotMessage((0, persona_1.getBreakEnd)());
                break;
        }
    }
    // ── 命令注册 ──────────────────────────────────
    const commands = [
        ['zhongli.openStage', () => {
                panel.addBotMessage((0, persona_1.getOpening)());
                panel.updateStats(stats.current);
            }],
        ['zhongli.startPomodoro', () => {
                if (pomodoro.isRunning) {
                    panel.addBotMessage('番茄钟仍在计时。契约既已订立，就不要中途反悔。');
                    return;
                }
                const minutes = vscode.workspace.getConfiguration('zhongli').get('pomodoroMinutes', 25);
                panel.addBotMessage((0, persona_1.getFocusStart)(minutes));
                pomodoro.start(minutes, onPomodoroPhase);
            }],
        ['zhongli.stopPomodoro', () => {
                pomodoro.stop();
                panel.addBotMessage('番茄钟已停止。虽然中途终止并非上策，但也无妨。调整好再出发。');
            }],
        ['zhongli.encourageMe', () => {
                panel.addBotMessage((0, persona_1.getEncourageLine)());
            }],
        ['zhongli.reviewWork', () => {
                const problems = (0, dynamicReply_1.analyzeCodeProblems)();
                const issues = problems.includes('⚖️') ? problems.split('\n').filter((l) => l.startsWith('⚖️')) : [];
                panel.addBotMessage((0, persona_1.getJudgment)(issues));
            }],
        ['zhongli.finale', () => {
                panel.addBotMessage((0, persona_1.getFinale)(pomodoro.completedCount));
            }],
        ['zhongli.lore', () => {
                panel.addBotMessage((0, persona_1.getLore)());
            }],
        ['zhongli.tea', () => {
                panel.addBotMessage((0, persona_1.getTea)());
            }],
        ['zhongli.hutao', () => {
                panel.addBotMessage((0, persona_1.getHutaoEasterEgg)());
            }],
    ];
    for (const [id, handler] of commands) {
        context.subscriptions.push(vscode.commands.registerCommand(id, handler));
    }
    // ── 首次欢迎 ──────────────────────────────────
    const welcomed = context.globalState.get('zhongli.welcomed');
    if (!welcomed) {
        panel.addBotMessage((0, persona_1.getOpening)());
        void context.globalState.update('zhongli.welcomed', true);
    }
    // ── 资源清理 ──────────────────────────────────
    context.subscriptions.push({
        dispose() {
            pomodoro.dispose();
            idle.dispose();
        },
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map