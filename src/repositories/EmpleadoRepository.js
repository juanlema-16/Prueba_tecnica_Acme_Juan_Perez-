/**
 * Repositorio de empleados en memoria.
 * Encapsula el arreglo donde se almacenan los empleados: el resto de la
 * aplicación no conoce cómo se guardan los datos, solo usa estos métodos.
 * Si en el futuro se usa una base de datos, basta con crear otro repositorio
 * con los mismos métodos.
 */
export class EmpleadoRepository {
  /** Almacenamiento interno, inaccesible desde fuera de la clase. */
  #empleados = [];

  /**
   * Agrega un empleado al almacenamiento.
   * @param {Empleado} empleado
   * @returns {Empleado} El empleado guardado.
   */
  guardar(empleado) {
    this.#empleados.push(empleado);
    return empleado;
  }

  /**
   * Devuelve una copia del listado para proteger el arreglo interno.
   * @returns {Empleado[]}
   */
  obtenerTodos() {
    return [...this.#empleados];
  }

  /**
   * Busca un empleado por su identificador único.
   * @param {string} id
   * @returns {Empleado|null} El empleado, o null si no existe.
   */
  buscarPorId(id) {
    return this.#empleados.find((empleado) => empleado.id === id) ?? null;
  }

  /**
   * Busca un empleado por su número de identificación.
   * @param {string} identificacion
   * @returns {Empleado|null} El empleado, o null si no existe.
   */
  buscarPorIdentificacion(identificacion) {
    return (
      this.#empleados.find((empleado) => empleado.identificacion === identificacion) ?? null
    );
  }

  /**
   * Reemplaza un empleado existente por su versión actualizada.
   * @param {Empleado} empleadoActualizado
   * @returns {Empleado|null} El empleado actualizado, o null si no existe.
   */
  actualizar(empleadoActualizado) {
    const indice = this.#buscarIndice(empleadoActualizado.id);
    if (indice === -1) {
      return null;
    }
    this.#empleados[indice] = empleadoActualizado;
    return empleadoActualizado;
  }

  /**
   * Elimina un empleado por su identificador único.
   * @param {string} id
   * @returns {boolean} true si se eliminó, false si no existía.
   */
  eliminar(id) {
    const indice = this.#buscarIndice(id);
    if (indice === -1) {
      return false;
    }
    this.#empleados.splice(indice, 1);
    return true;
  }

  /**
   * Devuelve la posición de un empleado en el arreglo, o -1 si no existe.
   * @param {string} id
   * @returns {number}
   */
  #buscarIndice(id) {
    return this.#empleados.findIndex((empleado) => empleado.id === id);
  }
}
