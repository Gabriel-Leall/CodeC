import { isMockMode } from "@/lib/mock-mode";
import { inMemoryTrainingAdapter } from "./in-memory-training-adapter";
import { integratedTrainingAdapter } from "./integrated-training-adapter";
import { selectTrainingAdapter, type TrainingAdapter } from "./training-adapter";

export const currentTrainingAdapter = selectTrainingAdapter<TrainingAdapter>(isMockMode(), {
  inMemory: inMemoryTrainingAdapter,
  integrated: integratedTrainingAdapter,
});
