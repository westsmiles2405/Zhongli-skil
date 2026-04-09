/**
 * 钟离番茄钟 — PomodoroTimer
 */

import * as vscode from 'vscode';

export type PomodoroPhase = 'focus-end' | 'break-start' | 'break-end';

export class PomodoroTimer {
    private timer: ReturnType<typeof setInterval> | undefined;
    private statusBarItem: vscode.StatusBarItem;
    private _isRunning = false;
    private _completedCount = 0;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    get completedCount(): number {
        return this._completedCount;
    }

    start(minutes: number, onPhase: (phase: PomodoroPhase) => void): void {
        if (this._isRunning) { return; }
        this.stop();
        this._isRunning = true;

        let remaining = minutes * 60;
        this.statusBarItem.text = `🪨 专注 ${this.formatTime(remaining)}`;
        this.statusBarItem.show();

        this.timer = setInterval(() => {
            remaining--;
            this.statusBarItem.text = `🪨 专注 ${this.formatTime(remaining)}`;

            if (remaining <= 0) {
                this.clearTimer();
                this._completedCount++;
                onPhase('focus-end');

                const breakMin = vscode.workspace.getConfiguration('zhongli').get<number>('breakMinutes', 5);
                let breakRemaining = breakMin * 60;
                this.statusBarItem.text = `🍵 休息 ${this.formatTime(breakRemaining)}`;
                onPhase('break-start');

                this.timer = setInterval(() => {
                    breakRemaining--;
                    this.statusBarItem.text = `🍵 休息 ${this.formatTime(breakRemaining)}`;

                    if (breakRemaining <= 0) {
                        this.stop();
                        onPhase('break-end');
                    }
                }, 1000);
            }
        }, 1000);
    }

    stop(): void {
        this.clearTimer();
        this._isRunning = false;
        this.statusBarItem.hide();
    }

    dispose(): void {
        this.stop();
        this.statusBarItem.dispose();
    }

    private formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    private clearTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}
