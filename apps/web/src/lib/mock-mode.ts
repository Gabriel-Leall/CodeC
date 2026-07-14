/**
 * Permite executar a interface localmente sem inicializar PostgreSQL ou Better Auth.
 * Altere este valor apenas para uma sessão local de desenvolvimento e não o envie como true.
 */
const MOCK_MODE_ENABLED = false;

export function isMockModeEnabled() {
  return MOCK_MODE_ENABLED;
}

export function isMockMode() {
  return isMockModeEnabled();
}
