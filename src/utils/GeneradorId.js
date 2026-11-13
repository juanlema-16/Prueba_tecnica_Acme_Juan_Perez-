import { randomUUID } from 'node:crypto';

/**
 * Genera identificadores únicos para los empleados (RF-01).
 * Usa el módulo nativo node:crypto, sin librerías de terceros.
 * Se encapsula en una clase para poder inyectarlo en el servicio
 * y reemplazarlo fácilmente (por ejemplo, en pruebas).
 */
export class GeneradorId {
  /**
   * @returns {string} Un UUID v4, por ejemplo "3b241101-e2bb-4255-8caf-4136c566a962".
   */
  generar() {
    return randomUUID();
  }
}
