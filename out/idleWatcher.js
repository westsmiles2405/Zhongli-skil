"use strict";
/**
 * 钟离闲置监测器 — IdleWatcher
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
exports.IdleWatcher = void 0;
const vscode = __importStar(require("vscode"));
class IdleWatcher {
    constructor(callback) {
        this.callback = callback;
        const config = vscode.workspace.getConfiguration('zhongli');
        const enabled = config.get('enableIdleReminder', true);
        const minutes = config.get('idleMinutes', 30);
        this.thresholdMs = minutes * 60 * 1000;
        if (enabled) {
            this.resetTimer();
            vscode.workspace.onDidChangeTextDocument(() => this.resetTimer());
            vscode.window.onDidChangeActiveTextEditor(() => this.resetTimer());
        }
    }
    resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.callback();
            this.resetTimer();
        }, this.thresholdMs);
    }
    dispose() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
}
exports.IdleWatcher = IdleWatcher;
//# sourceMappingURL=idleWatcher.js.map