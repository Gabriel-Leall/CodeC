/**
 * Permite executar a interface localmente sem inicializar PostgreSQL ou Better Auth.
 * Nunca é ativado por padrão: use USE_MOCK_DATA=true apenas no ambiente local.
 */
export function isMockModeEnabled(value = process.env.USE_MOCK_DATA) {
  return value === "true";
}

export function isMockMode() {
  return isMockModeEnabled();
}
