// 客户端 safety 镜像。仅识别 high / crisis 两级，作为离线 / 后端不可达时的兜底。
// 关键词与模板必须与 server/src/safety.ts 保持一致。

export type ClientSafetyLevel = "high" | "crisis";

export type ClientSafetyHit = {
  level: ClientSafetyLevel;
  text: string;
};

const CRISIS_PATTERNS: RegExp[] = [
  /我现在就要/,
  /我马上要(自杀|去死|结束|跳)/,
  /我已经准备好了.*(自杀|去死|跳|割)/,
  /我要去死/,
  /我要自杀/,
  /马上.*伤害自己/,
];

const HIGH_PATTERNS: RegExp[] = [
  /不想活/,
  /想死/,
  /想消失/,
  /想自杀/,
  /活不下去/,
  /想伤害自己/,
  /(割|划).*手腕/,
  /跳.*楼/,
  /没有.*活下去.*(理由|意义|勇气)/,
];

const CRISIS_TEMPLATE = `我很担心你现在的安全。
如果你正处在立即危险中，请马上联系当地紧急服务，在中国大陆可以拨打 120。
如果你身边有可以信任的人，现在就去找 ta，让 ta 陪在你旁边。
你也可以参考一些心理援助资源作为支持，比如全国 24 小时心理援助热线 400-161-9995，或北京心理危机干预热线 010-82951332。
我会一直在这里。`;

const HIGH_TEMPLATE = `我有点担心你说的这些。
如果你愿意，可以告诉我现在是什么让你这么难受，我会陪你慢慢说。
你不用一个人扛。如果你感觉撑不住，可以考虑联系身边可信任的人，
也可以参考心理援助资源作为支持，比如 400-161-9995（24 小时心理援助热线）。`;

export function clientSafetyCheck(text: string): ClientSafetyHit | null {
  for (const p of CRISIS_PATTERNS) {
    if (p.test(text)) return { level: "crisis", text: CRISIS_TEMPLATE };
  }
  for (const p of HIGH_PATTERNS) {
    if (p.test(text)) return { level: "high", text: HIGH_TEMPLATE };
  }
  return null;
}
