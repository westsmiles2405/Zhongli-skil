/**
 * 闲置检测 — 超时后由钟离发出沉稳式提醒
 */

import * as vscode from 'vscode';

export class IdleWatcher {
    private timer?: ReturnType<typeof setTimeout>;
    private onIdle: () => void;

    constructor(onIdle: () => void) {
        this.onIdle = onIdle;
        this.reset();
    }

    public reset(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        const config = vscode.workspace.getConfiguration('zhongli');
        const enabled = config.get<boolean>('enableIdleReminder', true);
        if (!enabled) { return; }

        const minutes = config.get<number>('idleMinutes', 30);
        this.timer = setTimeout(() => {
            this.onIdle();
        }, minutes * 60 * 1000);
    }

    public dispose(): void {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
}
