export type ZenRankKind = "kyu" | "dan";

export type ZenRank = {
  label: string;
  kind: ZenRankKind;
  level: number;
  progress?: number;
};
