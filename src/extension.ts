/**
 * 钟离工作陪伴 — 主入口
 */

import * as vscode from 'vscode';
import { ZhongliChatPanel } from './chatPanel';
import { generateResponse, analyzeCodeProblems, CODE_ANALYSIS_KEYWORDS } from './dynamicReply';
import { IdleWatcher } from './idleWatcher';
import {
    getBreakEnd,
    getBreakRemind,
    getEncourageLine,
    getFinale,
    getFocusEnd,
    getFocusStart,
    getHutaoEasterEgg,
    getIdleRemind,
    getJudgment,
    getLore,
    getOpening,
    getTea,
    getTimeBasedGreeting,
    getWorkLine,
} from './persona';
import { PomodoroTimer } from './pomodoro';
import { StatsTracker } from './stats';

export function activate(context: vscode.ExtensionContext): void {
    const panel = new ZhongliChatPanel(context.extensionUri);
    const pomodoro = new PomodoroTimer();
    const stats = new StatsTracker(context.globalState);
    const idleWatcher = new IdleWatcher(() => {
        panel.addBotMessage(getIdleRemind());
    });

    // ── 常驻状态栏 ──────────────────────────────────
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '🪨 钟离';
    statusBar.tooltip = '钟离工作陪伴';
    statusBar.command = 'zhongli.openStage';
    if (vscode.workspace.getConfiguration('zhongli').get<boolean>('enableStatusBar', true)) {
        statusBar.show();
    }
    context.subscriptions.push(statusBar);

    // ── 注册 Webview ─────────────────────────────────
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ZhongliChatPanel.viewType, panel),
    );

    // ── 用户消息处理 ──────────────────────────────────
    panel.setOnUserMessage((text) => {
        stats.recordMessage();
        panel.updateStats(stats.current);
        idleWatcher.reset();

        const lower = text.toLowerCase();
        if (CODE_ANALYSIS_KEYWORDS.some((k) => lower.includes(k))) {
            panel.addBotMessage(analyzeCodeProblems());
            return;
        }

        panel.addBotMessage(generateResponse(text));
    });

    // ── 首次欢迎引导 ──────────────────────────────────
    const welcomed = context.globalState.get<boolean>('zhongli.welcomed', false);
    if (!welcomed) {
        panel.addBotMessage('旅行者，初次见面。我是钟离，往生堂的客卿。今日起，由我来陪你工作。');
        panel.addBotMessage('你可以与我交谈、让我审视代码、或开启番茄钟专注。命令面板中搜索"钟离"可以找到更多功能。');
        panel.addBotMessage('契约既已订立，便不可轻言放弃。——准备好了吗？');
        void context.globalState.update('zhongli.welcomed', true);
    } else {
        panel.addBotMessage(getTimeBasedGreeting());
    }

    // 初始推送统计
    panel.updateStats(stats.current);

    // ── 命令注册 ──────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('zhongli.openStage', () => {
            const msg = getOpening();
            panel.addBotMessage(msg);
            panel.addBotMessage(getTimeBasedGreeting());
            void vscode.window.showInformationMessage(`🪨 钟离：${msg}`);
        }),
        vscode.commands.registerCommand('zhongli.startPomodoro', () => {
            if (pomodoro.isRunning) {
                panel.addBotMessage('番茄钟仍在计时。契约既已订立，就不要中途反悔。');
                return;
            }
            const minutes = vscode.workspace.getConfiguration('zhongli').get<number>('pomodoroMinutes', 25);
            panel.addBotMessage(getFocusStart(minutes));
            pomodoro.start(minutes, (phase) => {
                switch (phase) {
                    case 'focus-end':
                        panel.addBotMessage(getFocusEnd());
                        stats.recordPomodoro();
                        panel.updateStats(stats.current);
                        void vscode.window.showInformationMessage('🪨 钟离：这一段契约已经履行完毕。');
                        break;
                    case 'break-start':
                        panel.addBotMessage(getBreakRemind());
                        void vscode.window.showInformationMessage('🪨 钟离：休息时间到了，去喝口茶吧。');
                        break;
                    case 'break-end':
                        panel.addBotMessage(getBreakEnd());
                        void vscode.window.showInformationMessage('🪨 钟离：休息结束，继续前行。');
                        break;
                }
            });
        }),
        vscode.commands.registerCommand('zhongli.stopPomodoro', () => {
            if (!pomodoro.isRunning) {
                panel.addBotMessage('番茄钟尚未启动。若你想订立一份专注的契约，随时可以开始。');
                void vscode.window.showInformationMessage('🪨 钟离：番茄钟尚未开始。');
                return;
            }
            pomodoro.stop();
            panel.addBotMessage('番茄钟已停止。虽然中途终止并非上策，但也无妨。调整好再出发。');
            void vscode.window.showInformationMessage('🪨 钟离：番茄钟已结束。');
        }),
        vscode.commands.registerCommand('zhongli.encourageMe', () => {
            const msg = getEncourageLine();
            panel.addBotMessage(msg);
            void vscode.window.showInformationMessage(`🪨 钟离：${msg}`);
        }),
        vscode.commands.registerCommand('zhongli.reviewWork', () => {
            const diagnostics = vscode.languages.getDiagnostics();
            const issues: string[] = [];
            for (const [uri, diags] of diagnostics) {
                for (const diag of diags) {
                    if (diag.severity === vscode.DiagnosticSeverity.Error) {
                        const fileName = vscode.workspace.asRelativePath(uri);
                        issues.push(`${fileName}:${diag.range.start.line + 1} — ${diag.message}`);
                    }
                }
            }
            const totalErrors = issues.length;
            const topIssues = issues.slice(0, 10);
            if (totalErrors > 10) {
                topIssues.push(`……以及另外 ${totalErrors - 10} 处条款违约。`);
            }
            panel.addBotMessage(getJudgment(topIssues));
            void vscode.window.showInformationMessage(`🪨 钟离：契约审判发现 ${totalErrors} 项错误。`);
        }),
        vscode.commands.registerCommand('zhongli.finale', () => {
            const msg = getFinale(pomodoro.completedCount);
            panel.addBotMessage(msg);
            pomodoro.stop();
            void vscode.window.showInformationMessage(`🪨 钟离：${msg}`);
        }),
        vscode.commands.registerCommand('zhongli.lore', () => {
            panel.addBotMessage(getLore());
        }),
        vscode.commands.registerCommand('zhongli.tea', () => {
            panel.addBotMessage(getTea());
        }),
        vscode.commands.registerCommand('zhongli.hutao', () => {
            panel.addBotMessage(getHutaoEasterEgg());
        }),

        // ── 保存事件 → 统计 + 插话 ──────────────────────
        vscode.workspace.onDidSaveTextDocument(() => {
            stats.recordSave();
            panel.updateStats(stats.current);
            idleWatcher.reset();
            if (stats.current.todaySaves % 10 === 0) {
                panel.addBotMessage(getWorkLine());
            }
        }),

        // ── 编辑事件 → 重置闲置 ──────────────────────────
        vscode.workspace.onDidChangeTextDocument(() => {
            idleWatcher.reset();
        }),
        vscode.window.onDidChangeActiveTextEditor(() => {
            idleWatcher.reset();
        }),

        // ── 清理 ──────────────────────────────────────────
        {
            dispose() {
                pomodoro.dispose();
                idleWatcher.dispose();
            },
        },
    );
}

export function deactivate(): void { }
