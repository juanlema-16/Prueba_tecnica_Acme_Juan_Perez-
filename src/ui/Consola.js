import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/**
 * Envoltorio sobre el módulo nativo readline para leer y escribir en la terminal.
 * Es la única clase que conoce readline: si mañana la entrada cambia
 * (por ejemplo, a una interfaz web), solo se reemplaza esta clase.
 */
export class Consola {
  #rl;
  #cerrada = false;
  #alCerrar;

  constructor() {
    this.#rl = readline.createInterface({ input, output });
    // Promesa que se rechaza cuando la entrada se cierra, para cancelar
    // cualquier pregunta pendiente en lugar de dejarla esperando para siempre.
    this.#alCerrar = new Promise((_, reject) => {
      this.#rl.once('close', () => {
        this.#cerrada = true;
        reject(new Error('La entrada de la consola se cerró.'));
      });
    });
    this.#alCerrar.catch(() => {});
  }

  /** Indica si la entrada se cerró (Ctrl + C, Ctrl + D o fin de la entrada). */
  get cerrada() {
    return this.#cerrada;
  }

  /**
   * Muestra un mensaje y espera la respuesta del usuario.
   * @param {string} mensaje
   * @returns {Promise<string>} La respuesta sin espacios al inicio ni al final.
   */
  async preguntar(mensaje) {
    const respuesta = await Promise.race([this.#rl.question(mensaje), this.#alCerrar]);
    return respuesta.trim();
  }

  /**
   * Escribe una línea en la terminal.
   * @param {string} [mensaje='']
   */
  escribir(mensaje = '') {
    console.log(mensaje);
  }

  /**
   * Muestra datos en forma de tabla.
   * @param {object[]} filas
   */
  tabla(filas) {
    console.table(filas);
  }

  /** Libera la terminal. */
  cerrar() {
    if (!this.#cerrada) {
      this.#rl.close();
    }
  }
}
