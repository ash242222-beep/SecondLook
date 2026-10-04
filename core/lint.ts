import { SecondLook } from "./types.ts";

export const BANNED = [
  /\byou should\b/i,
  /\bI(?:'d| would)? (?:recommend|suggest|advise)\b/i,
  /\b(?:best|better|worse|wiser|smarter|safer) (?:option|choice|decision|path)\b/i,
  /\bthe (?:right|wrong) (?:choice|call|decision|move)\b/i,
  /\byou (?:ought|need|must|have) to\b/i,
  /\b(?:go|going) (?:for|with) (?:option|the)\b/i,
  /\bI(?:'d| would) (?:accept|decline|take|choose|pick)\b/i,
  /\bmakes? (?:more )?sense to\b/i,
  /\bno-brainer\b/i,
  /\bshould (?:accept|decline|take|choose|pick|go)\b/i,
  /\b(?:clearly|obviously) (?:the|you)\b/i,
  /\bdon'?t (?:accept|take|decline|do)\b/i,
];

export interface LintHit {
  path: string;
  text: string;
}

export function lintResult(result: SecondLook): LintHit[] {
  const hits: LintHit[] = [];

  function walk(node: unknown, path: string[]) {
    if (typeof node === "string") {
      const lastKey = path[path.length - 1] ?? "";
      if (/quote$/i.test(lastKey)) return; // skip user quotes verbatim
      for (const rx of BANNED) {
        if (rx.test(node)) {
          hits.push({ path: path.join("."), text: node });
          break;
        }
      }
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        walk(v, [...path, k]);
      }
    }
  }

  walk(result, []);
  return hits;
}

export function checkQuotes(result: SecondLook, userText: string): SecondLook {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const src = norm(userText);

  function walk(node: any) {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) {
        if (/quote$/i.test(k) && typeof v === "string" && v) {
          if (!src.includes(norm(v))) {
            node[k] = "";
          }
        } else {
          walk(v);
        }
      }
    }
  }

  walk(result);
  return result;
}

export function balance(result: SecondLook): { A: number; B: number; ok: boolean } {
  if (!result.blind_spots || !Array.isArray(result.blind_spots)) {
    return { A: 0, B: 0, ok: false };
  }
  const n = (id: "A" | "B") =>
    result.blind_spots.filter(
      (b) => b.applies_to === id || b.applies_to === "both"
    ).length;
  const countA = n("A");
  const countB = n("B");
  return { A: countA, B: countB, ok: countA >= 2 && countB >= 2 };
}
