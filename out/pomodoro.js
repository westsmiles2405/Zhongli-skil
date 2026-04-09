"use strict";
/**
 * 钟离番茄钟 — PomodoroTimer
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
exports.PomodoroTimer = void 0;
const vscode = __importStar(require("vscode"));
class PomodoroTimer {
    constructor() {
        this._isRunning = false;
        this._completedCount = 0;
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    }
    get isRunning() {
        return this._isRunning;
    }
    get completedCount() {
        return this._completedCount;
    }
    start(minutes, onPhase) {
        if (this._isRunning) {
            return;
        }
        this._isRunning = true;
        let remaining = minutes * 60;
        this.statusBarItem.text = `🪨 专注 ${minutes}:00`;
        this.statusBarItem.show();
        this.timer = setInterval(() => {
            remaining--;
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            this.statusBarItem.text = `🪨 专注 ${m}:${s.toString().padStart(2, '0')}`;
            if (remaining <= 0) {
                this.clearTimer();
                this._completedCount++;
                this._isRunning = false;
                onPhase('focus-end');
                // 休息阶段
                const breakMin = vscode.workspace.getConfiguration('zhongli').get('breakMinutes', 5);
                let breakRemaining = breakMin * 60;
                this.statusBarItem.text = `🍵 休息 ${breakMin}:00`;
                onPhase('break-start');
                this.timer = setInterval(() => {
                    breakRemaining--;
                    const bm = Math.floor(breakRemaining / 60);
                    const bs = breakRemaining % 60;
                    this.statusBarItem.text = `🍵 休息 ${bm}:${bs.toString().padStart(2, '0')}`;
                    if (breakRemaining <= 0) {
                        this.clearTimer();
                        this.statusBarItem.hide();
                        onPhase('break-end');
                    }
                }, 1000);
            }
        }, 1000);
    }
    stop() {
        this.clearTimer();
        this._isRunning = false;
        this.statusBarItem.hide();
    }
    dispose() {
        this.stop();
        this.statusBarItem.dispose();
    }
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}
exports.PomodoroTimer = PomodoroTimer;
//# sourceMappingURL=pomodoro.js.map