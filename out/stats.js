"use strict";
/**
 * 钟离工作统计 — ZhongliStats
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsManager = void 0;
class StatsManager {
    constructor(state) {
        this.state = state;
    }
    get current() {
        const today = new Date().toISOString().slice(0, 10);
        const saved = this.state.get(StatsManager.KEY);
        if (!saved || saved.lastActiveDate !== today) {
            return { messagesCount: 0, pomodorosCompleted: 0, lastActiveDate: today };
        }
        return { ...saved };
    }
    addMessage() {
        const stats = this.current;
        stats.messagesCount++;
        void this.state.update(StatsManager.KEY, stats);
    }
    addPomodoro() {
        const stats = this.current;
        stats.pomodorosCompleted++;
        void this.state.update(StatsManager.KEY, stats);
    }
}
exports.StatsManager = StatsManager;
StatsManager.KEY = 'zhongli.stats';
//# sourceMappingURL=stats.js.map