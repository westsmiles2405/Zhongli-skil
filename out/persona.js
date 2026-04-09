"use strict";
/**
 * 钟离人格引擎 — 台词库与模式切换
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpening = getOpening;
exports.getWorkLine = getWorkLine;
exports.getEncourageLine = getEncourageLine;
exports.getComfort = getComfort;
exports.getSolemnComfort = getSolemnComfort;
exports.getJudgment = getJudgment;
exports.getFocusStart = getFocusStart;
exports.getFocusEnd = getFocusEnd;
exports.getBreakRemind = getBreakRemind;
exports.getBreakEnd = getBreakEnd;
exports.getFinale = getFinale;
exports.getIdleRemind = getIdleRemind;
exports.getLore = getLore;
exports.getTea = getTea;
exports.getHutaoEasterEgg = getHutaoEasterEgg;
exports.getTimeBasedGreeting = getTimeBasedGreeting;
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
// ── 开场白 ──────────────────────────────────────
const OPENING_LINES = [
    '一份新的契约……好吧，今日由我来监督你的工作。',
    '准备好了吗？契约既已订立，便当全力以赴。',
    '今日的工作，交由你执行，由我来守护。',
    '既然坐到了这里，就不要辜负这段时光。',
    '旅行者，我们之间有契约在先——认真工作，方能共赢。',
];
// ── 陪工插话 ──────────────────────────────────────
const WORK_LINES = [
    '不错，步调很稳。保持这个节奏就好。',
    '你的代码像璃月的阶梯一般，一步一步，稳扎稳打。',
    '黄金是璃月的血液，而代码是你的心脏——保持跳动。',
    '慢一点没关系，重要的是每一步都踩得实。',
    '做事讲究规矩。你现在的规矩，不错。',
    '这段进展令我想起璃月港的工匠——朴实但有分量。',
    '继续。我会在一旁看着。',
    '有条不紊，这便是契约精神。',
];
// ── 鼓励打气 ──────────────────────────────────────
const ENCOURAGE_LINES = [
    '不以规矩，不能成方圆。你已经走在正确的路上了。',
    '磐石之下亦有裂缝，但裂缝中照样长得出花。',
    '坚持本身就是一种力量。继续。',
    '你比你以为的更有韧性。这一点，我看得出来。',
    '困难不过是代码里的一个 bug，终会被修好。',
    '璃月曾经也有过最艰难的时候。但它依然矗立千年。',
    '以你目前的势头，这个问题不会困住你太久。',
    '不要急于求成。时间会淬炼一切意志。',
    '你的努力不会白费，就像岩石不会轻易被风化。',
];
// ── 安抚关怀 ──────────────────────────────────────
const COMFORT_LINES = [
    '累了就休息一下吧。急于赶路，反而容易迷失。',
    '没关系。人生本就有起伏，像璃月的山脉一样。',
    '允许自己停下来，这不是软弱，而是智慧。',
    '即便是岩石也需要时间来成形。你不必苛责自己。',
    '你现在感到的疲惫，说明你确实在努力。这本身就值得肯定。',
    '别担心。我就在这里，什么都不会变。',
];
// ── 庄重安慰（深层悲伤）──────────────────────────
const SOLEMN_COMFORT = [
    '……我活了六千年，见过太多的离别与苦难。但每一个坚持到现在的人，都值得被记住。你也是。',
    '你不必假装坚强。在这片土地上活了这么久，我知道脆弱也是一种真实。',
    '契约无法界定友谊……但至少，我此刻的陪伴是真实的。',
    '即使你感到无力改变什么——你此刻还在这里，这本身就是一种勇气。',
    '时间会淬炼一切意志。这段最难的路，走过去之后回头看，会变成你最厚重的磐石。',
];
// ── 审判台词 ──────────────────────────────────────
const JUDGMENT_PATTERNS = [
    '【契约审判开庭】\n以岩王帝君之名，审视今日之代码——',
    '【契约条款核查】\n让我看看，你的代码是否履行了品质的承诺——',
    '【璃月质检】\n好的代码如同好的契约，不应留有含糊之处——',
];
// ── 番茄钟 ──────────────────────────────────────
const FOCUS_START = [
    '好。从现在开始，沉下心来。',
    '契约时间开始。在这段时间里，专心即是履约。',
    '坐好。这段时间属于你和你的代码。',
];
const FOCUS_END = [
    '专注时间结束了。做得不错，该休息一下。',
    '这一段路走得很稳。先放松片刻。',
    '时间到了。你已经履行了这一段契约。',
];
const FOCUS_BREAK_REMIND = [
    '去喝口茶吧。好的茶需要时间来泡，人也一样。',
    '休息是为了更好地出发。不必急着回来。',
    '起来走走。看看窗外的天色，调整一下心神。',
];
const FOCUS_BREAK_END = [
    '差不多了。调整好心态，我们继续。',
    '休憩结束了。重新拾起那份契约精神吧。',
    '好了。你已经恢复了一些力气，带上它继续前行。',
    '该回来了。契约还在等着你。',
    '时间到。我们继续完成今天的份内之事。',
];
// ── 谢幕 ──────────────────────────────────────
const FINALE_LINES = [
    '今日的契约到此结束。辛苦了。',
    '不错的一天。休息吧，明日还有新的契约在等。',
    '从容收工，才是最好的结尾。今天可以了。',
    '你今天的表现，没有辜负我们之间的契约。',
    '日落之后，就放下键盘吧。明天会更好。',
];
// ── 闲置提醒 ──────────────────────────────────
const IDLE_REMIND = [
    '……旅行者？你还在吗？',
    '已经过去很久了。是在思考，还是在发呆？',
    '如果需要休息，直说便是。不必撑着。',
    '你是在等什么吗？若没事，就继续工作吧。',
    '闲下来的时间，也是契约的一部分——但不宜太久。',
    '我注意到你已经停下来很久了。是遇到困难了吗？',
];
// ── 璃月典故（独有1）──────────────────────────
const LORE_LINES = [
    '🏛️ 你知道吗——璃月港的每一块地基，都是在契约之上建立的。岩王帝君与人类的约定，从未被打破。',
    '🏛️ "欲买桂花同载酒……"这首诗的故人，已不在了。但他留下的记忆，比任何契约都长久。',
    '🏛️ 璃月的摩拉，由岩王帝君亲手铸造。每一枚硬币上，都有契约的重量。',
    '🏛️ 天衡山上曾有仙人在此修行。他们虽已离去，但留下的阵法仍在守护这片土地。',
    '🏛️ 你可知"集市三步一契约"的典故？在璃月做生意，诚信便是最硬的通货。',
    '🏛️ 归离原的战争，是璃月历史上最惨烈的一页。但正是那场战争，奠定了契约的意义。',
];
// ── 沏茶（独有2）──────────────────────────────
const TEA_LINES = [
    '🍵 来，尝尝这壶"清心醒神茶"。口感微苦，但回甘悠长——如同调试 bug 的过程。',
    '🍵 好茶需要时间。急不得。先喝一口，让脑子缓一缓。',
    '🍵 这壶茶的配方是我从绝云间带回来的。据说能让人的思路清晰三个时辰。',
    '🍵 "醒神茶"泡好了。趁热喝。——放心，不会像派蒙说的那么苦。',
    '🍵 你知道吗？好的茶和好的代码有一个共同点：都需要耐心和火候。',
    '🍵 喝完这杯茶，我们再继续。契约不急在这一刻。',
];
// ── 胡桃彩蛋（独有3）──────────────────────────
const HUTAO_LINES = [
    '……胡桃？你说的是往生堂那位堂主？她确实精力充沛，只是……有时候让人头疼。',
    '她总是试图给我推销"特别优惠套餐"。我已经跟她说过了，我暂时不需要那种服务。',
    '胡桃这个人……做事认真，但方式嘛，稍微有点出人意料。你和她处得来倒不意外。',
    '说到胡桃——她上次带我吃了一种叫"安神菜"的东西。味道……我不做评价。',
    '往生堂的事务，自有她去打理。我只负责……偶尔帮她挡一挡过于热情的客户。',
];
// ── 导出函数 ──────────────────────────────────
function getOpening() {
    return pick(OPENING_LINES);
}
function getWorkLine() {
    return pick(WORK_LINES);
}
function getEncourageLine() {
    return pick(ENCOURAGE_LINES);
}
function getComfort() {
    return pick(COMFORT_LINES);
}
function getSolemnComfort() {
    return pick(SOLEMN_COMFORT);
}
function getJudgment(issues) {
    const intro = pick(JUDGMENT_PATTERNS);
    if (issues.length === 0) {
        return `${intro}\n\n✅ 代码通过契约审查。未发现违约之处。继续保持。`;
    }
    const list = issues.map((i) => `⚖️ ${i}`).join('\n');
    return `${intro}\n\n${list}\n\n📜 以上便是契约中的瑕疵。逐一修正，方可完善。`;
}
function getFocusStart(minutes) {
    return `${pick(FOCUS_START)}（${minutes} 分钟）`;
}
function getFocusEnd() {
    return pick(FOCUS_END);
}
function getBreakRemind() {
    return pick(FOCUS_BREAK_REMIND);
}
function getBreakEnd() {
    return pick(FOCUS_BREAK_END);
}
function getFinale(tasksDone) {
    const base = pick(FINALE_LINES);
    if (tasksDone > 0) {
        return `${base}\n今日你完成了 ${tasksDone} 个番茄钟。这份勤勉，值得被记住。`;
    }
    return base;
}
function getIdleRemind() {
    return pick(IDLE_REMIND);
}
function getLore() {
    return pick(LORE_LINES);
}
function getTea() {
    return pick(TEA_LINES);
}
function getHutaoEasterEgg() {
    return pick(HUTAO_LINES);
}
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) {
        return '夜深了。即便身体是铁打的，也该让它歇一歇。';
    }
    if (hour < 9) {
        return '清晨的璃月港最安静。趁这份宁静，理清今日的工作。';
    }
    if (hour < 12) {
        return '上午好。头脑最清醒的时段，适合做最重要的事。';
    }
    if (hour < 14) {
        return '午间了。去吃点东西吧，空着肚子签不好契约。';
    }
    if (hour < 18) {
        return '下午的时光总是过得特别快。把握好节奏，别让它溜走。';
    }
    if (hour < 22) {
        return '傍晚了。今日的契约完成得如何？若还有余力，可以再推进一些。';
    }
    return '夜已深。若还有未完之事，尽量收尾；若累了，就去休息。';
}
//# sourceMappingURL=persona.js.map