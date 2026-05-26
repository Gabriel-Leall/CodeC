export interface DanRank {
  kyuDan: string;   // e.g. "5th Kyu" or "1st Dan"
  kanji: string;    // e.g. "五級" or "初段"
  description: string; // e.g. "Cerebral Novice" or "Sumi Master"
}

export function eloToDanRank(elo: number): DanRank {
  if (elo < 800) {
    return { kyuDan: "10th Kyu", kanji: "十級", description: "Iniciado (Novice)" };
  }
  if (elo < 900) {
    return { kyuDan: "9th Kyu", kanji: "九級", description: "Aspirante (Initiate)" };
  }
  if (elo < 1000) {
    return { kyuDan: "8th Kyu", kanji: "八級", description: "Estudante (Scholar)" };
  }
  if (elo < 1100) {
    return { kyuDan: "7th Kyu", kanji: "七級", description: "Leitor Ativo (Active Reader)" };
  }
  if (elo < 1200) {
    return { kyuDan: "6th Kyu", kanji: "六級", description: "Codificador (Coder)" };
  }
  if (elo < 1300) {
    return { kyuDan: "5th Kyu", kanji: "五級", description: "Estrategista (Strategist)" };
  }
  if (elo < 1400) {
    return { kyuDan: "4th Kyu", kanji: "四級", description: "Diagnosticador (Diagnostician)" };
  }
  if (elo < 1500) {
    return { kyuDan: "3rd Kyu", kanji: "三級", description: "Analista (Analyst)" };
  }
  if (elo < 1600) {
    return { kyuDan: "2nd Kyu", kanji: "二級", description: "Revisor (Reviewer)" };
  }
  if (elo < 1700) {
    return { kyuDan: "1st Kyu", kanji: "一級", description: "Candidato a Mestre (Master Candidate)" };
  }
  if (elo < 1800) {
    return { kyuDan: "1st Dan", kanji: "初段", description: "Mestre do Código (Code Master)" };
  }
  if (elo < 1900) {
    return { kyuDan: "2nd Dan", kanji: "二段", description: "Mestre de Fluxos (Flow Master)" };
  }
  if (elo < 2000) {
    return { kyuDan: "3rd Dan", kanji: "三段", description: "Mestre de Efeitos (Effect Master)" };
  }
  if (elo < 2100) {
    return { kyuDan: "4th Dan", kanji: "四段", description: "Sábio da Memória (Memory Sage)" };
  }
  if (elo < 2200) {
    return { kyuDan: "5th Dan", kanji: "五段", description: "Sábio de Closures (Closure Sage)" };
  }
  if (elo < 2300) {
    return { kyuDan: "6th Dan", kanji: "六段", description: "Grão-Mestre (Grandmaster)" };
  }
  if (elo < 2400) {
    return { kyuDan: "7th Dan", kanji: "七段", description: "Grão-Mestre Sênior (Senior Grandmaster)" };
  }
  if (elo < 2500) {
    return { kyuDan: "8th Dan", kanji: "八段", description: "Lenda do Código (Code Legend)" };
  }
  return { kyuDan: "9th Dan", kanji: "九段", description: "Ascendido (Ascended)" };
}
