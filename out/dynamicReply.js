"use strict";
/**
 * 钟离动态回复引擎 — 关键词意图识别 + 沉稳风格响应
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
exports.CODE_ANALYSIS_KEYWORDS = void 0;
exports.generateResponse = generateResponse;
exports.analyzeCodeProblems = analyzeCodeProblems;
const vscode = __importStar(require("vscode"));
const persona_1 = require("./persona");
const DEEP_SAD_KEYWORDS = [
    '想死', '活不下去', '没意义', '太痛苦', '撑不住', '不想活', '毫无希望',
];
const SAD_KEYWORDS = [
    '难过', '伤心', '烦', '累', '焦虑', '崩溃', '失败', '郁闷', '绝望', '想放弃',
];
const WORK_KEYWORDS = [
    '代码', '编程', 'debug', 'bug', '修复', '重构', '优化', '函数', '需求', '测试', '部署',
];
const ENCOURAGE_KEYWORDS = [
    '加油', '鼓励', '打气', '坚持', '支持', '没动力', '顶不住',
];
const GREETING_KEYWORDS = [
    '你好', '早上好', '晚上好', 'hi', 'hello', '在吗', '钟离',
];
const LORE_KEYWORDS = ['典故', '故事', '历史', '璃月', '传说', '讲讲'];
const TEA_KEYWORDS = ['茶', '喝点', '放松', '休息一下', '歇一歇'];
const HUTAO_KEYWORDS = ['胡桃', '往生堂', '堂主'];
exports.CODE_ANALYSIS_KEYWORDS = ['分析', '诊断', '检查代码', '代码质量', '有没有错'];
function analyzeIntent(text) {
    const lower = text.toLowerCase();
    if (DEEP_SAD_KEYWORDS.some((k) => lower.includes(k))) {
        return 'deep_sad';
    }
    if (LORE_KEYWORDS.some((k) => lower.includes(k))) {
        return 'lore';
    }
    if (TEA_KEYWORDS.some((k) => lower.includes(k))) {
        return 'tea';
    }
    if (HUTAO_KEYWORDS.some((k) => lower.includes(k))) {
        return 'hutao';
    }
    if (SAD_KEYWORDS.some((k) => lower.includes(k))) {
        return 'sad';
    }
    if (ENCOURAGE_KEYWORDS.some((k) => lower.includes(k))) {
        return 'encourage';
    }
    if (WORK_KEYWORDS.some((k) => lower.includes(k))) {
        return 'work';
    }
    if (GREETING_KEYWORDS.some((k) => lower.includes(k))) {
        return 'greeting';
    }
    return 'unknown';
}
function extractInfo(text) {
    const lower = text.toLowerCase();
    if (lower.includes('报错') || lower.includes('error') || lower.includes('bug')) {
        return { type: 'bug', detail: '报错信息如同契约中的条款——逐条审视，方能找到症结。' };
    }
    if (lower.includes('deadline') || lower.includes('来不及') || lower.includes('赶')) {
        return { type: 'deadline', detail: '时间紧迫时，优先完成最关键的部分。契约的核心，在于主要条款。' };
    }
    if (lower.includes('同事') || lower.includes('老板') || lower.includes('领导')) {
        return { type: 'people', detail: '人与人之间的合作，也是一种契约。彼此尊重，方能长久。' };
    }
    return { type: 'general', detail: '' };
}
function generateResponse(userMessage) {
    const intent = analyzeIntent(userMessage);
    const info = extractInfo(userMessage);
    switch (intent) {
        case 'deep_sad':
            return (0, persona_1.getSolemnComfort)();
        case 'sad':
            return info.detail ? `${(0, persona_1.getComfort)()}\n\n${info.detail}` : (0, persona_1.getComfort)();
        case 'encourage':
            return (0, persona_1.getEncourageLine)();
        case 'work':
            return info.detail ? `${(0, persona_1.getWorkLine)()}\n\n${info.detail}` : (0, persona_1.getWorkLine)();
        case 'greeting':
            return (0, persona_1.getTimeBasedGreeting)();
        case 'lore':
            return (0, persona_1.getLore)();
        case 'tea':
            return (0, persona_1.getTea)();
        case 'hutao':
            return (0, persona_1.getHutaoEasterEgg)();
        default: {
            const responses = [
                '嗯……你说的我大致理解了。若能再具体些，我可以给出更有针对性的建议。',
                '这件事……让我想想该如何回应。',
                '你的话我听到了。不急，慢慢说。',
                '如果你愿意，可以展开说一下。我会认真听。',
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
}
function analyzeCodeProblems() {
    const diagnostics = vscode.languages.getDiagnostics();
    let errorCount = 0;
    let warnCount = 0;
    const topIssues = [];
    for (const [uri, diags] of diagnostics) {
        for (const d of diags) {
            if (d.severity === vscode.DiagnosticSeverity.Error) {
                errorCount++;
                if (topIssues.length < 5) {
                    const f = uri.path.split('/').pop() ?? uri.path;
                    topIssues.push(`⚖️ ${f}:${d.range.start.line + 1} — ${d.message}`);
                }
            }
            else if (d.severity === vscode.DiagnosticSeverity.Warning) {
                warnCount++;
            }
        }
    }
    if (errorCount === 0 && warnCount === 0) {
        return '代码状况良好。没有发现违反契约的地方。继续保持这份严谨。';
    }
    let result = `📜 契约审查报告：${errorCount} 项错误，${warnCount} 项警告。\n\n`;
    if (topIssues.length > 0) {
        result += topIssues.join('\n');
        if (errorCount > 5) {
            result += `\n……以及另外 ${errorCount - 5} 项问题。`;
        }
    }
    result += '\n\n逐一修正这些问题，契约方能完善。';
    return result;
}
//# sourceMappingURL=dynamicReply.js.map