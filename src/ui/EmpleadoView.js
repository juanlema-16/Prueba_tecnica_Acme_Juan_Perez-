/**
 * Vista de empleados: sabe cómo PEDIR los datos al usuario y cómo MOSTRARLOS.
 * También normaliza la entrada (género en mayúscula, salario como número)
 * antes de entregarla al servicio. No contiene reglas de negocio.
 */
export class EmpleadoView {
  /** Campos del formulario con la etiqueta que ve el usuario. */
  static CAMPOS = [
    { clave: 'identificacion', etiqueta: 'Identificación' },
    { clave: 'nombres', etiqueta: 'Nombres' },
    { clave: 'apellidos', etiqueta: 'Apellidos' },
    { clave: 'genero', etiqueta: 'Género (M/F/O)' },
    { clave: 'email', etiqueta: 'Email' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'direccion', etiqueta: 'Dirección' },
    { clave: 'ciudad', etiqueta: 'Ciudad de residencia' },
    { clave: 'profesion', etiqueta: 'Profesión' },
    { clave: 'cargo', etiqueta: 'Cargo' },
    { clave: 'salario', etiqueta: 'Salario (solo números)' },
  ];

  #consola;

  /** @param {Consola} consola */
  constructor(consola) {
    this.#consola = consola;
  }

  /**
   * Pide todos los datos de un empleado nuevo.
   * @returns {Promise<object>}
   */
  async pedirDatos() {
    this.#titulo('Registrar empleado');
    const datos = {};
    for (const { clave, etiqueta } of EmpleadoView.CAMPOS) {
      const respuesta = await this.#consola.preguntar(`${etiqueta}: `);
      datos[clave] = this.#normalizar(clave, respuesta);
    }
    return datos;
  }

  /**
   * Pide los cambios de un empleado existente. Si el usuario presiona Enter
   * sin escribir nada, el campo conserva su valor actual (queda undefined).
   * @param {Empleado} empleado
   * @returns {Promise<object>}
   */
  async pedirCambios(empleado) {
    this.#consola.escribir('\nEscriba el nuevo valor o presione Enter para conservar el actual.');
    const cambios = {};
    for (const { clave, etiqueta } of EmpleadoView.CAMPOS) {
      const respuesta = await this.#consola.preguntar(`${etiqueta} [${empleado[clave]}]: `);
      cambios[clave] = respuesta === '' ? undefined : this.#normalizar(clave, respuesta);
    }
    return cambios;
  }

  /** @returns {Promise<string>} */
  async pedirIdentificacion() {
    return this.#consola.preguntar('Identificación del empleado: ');
  }

  /** @returns {Promise<string>} */
  async pedirId() {
    return this.#consola.preguntar('ID único del empleado (puede verlo en el listado): ');
  }

  /**
   * Pide una confirmación de sí o no.
   * @param {string} mensaje
   * @returns {Promise<boolean>}
   */
  async confirmar(mensaje) {
    const respuesta = await this.#consola.preguntar(`${mensaje} (S/N): `);
    return respuesta.toUpperCase() === 'S';
  }

  /**
   * Muestra el detalle completo de un empleado.
   * @param {Empleado} empleado
   */
  mostrarEmpleado(empleado) {
    const datos = empleado.toJSON();
    this.#consola.escribir('');
    this.#consola.escribir(`  ID único: ${datos.id}`);
    for (const { clave, etiqueta } of EmpleadoView.CAMPOS) {
      const valor = clave === 'salario' ? this.#formatearSalario(datos.salario) : datos[clave];
      this.#consola.escribir(`  ${etiqueta.replace(/ \(.*\)$/, '')}: ${valor}`);
    }
  }

  /**
   * Muestra el listado de empleados en forma de tabla.
   * @param {Empleado[]} empleados
   */
  mostrarLista(empleados) {
    this.#titulo(`Empleados registrados (${empleados.length})`);
    if (empleados.length === 0) {
      this.mostrarAviso('No hay empleados registrados.');
      return;
    }
    this.#consola.tabla(
      empleados.map((empleado) => ({
        'ID único': empleado.id,
        Identificación: empleado.identificacion,
        'Nombre completo': empleado.nombreCompleto,
        Cargo: empleado.cargo,
        Salario: this.#formatearSalario(empleado.salario),
      })),
    );
  }

  /** @param {string} texto */
  mostrarTitulo(texto) {
    this.#titulo(texto);
  }

  /** @param {string} mensaje */
  mostrarExito(mensaje) {
    this.#consola.escribir(`\n✅ ${mensaje}`);
  }

  /** @param {string} mensaje */
  mostrarAviso(mensaje) {
    this.#consola.escribir(`\nℹ️  ${mensaje}`);
  }

  /** @param {string} mensaje */
  mostrarError(mensaje) {
    this.#consola.escribir(`\n❌ ${mensaje}`);
  }

  /**
   * Convierte la respuesta de texto al formato que espera el servicio.
   * @param {string} clave
   * @param {string} valor
   * @returns {string|number}
   */
  #normalizar(clave, valor) {
    if (clave === 'genero') {
      return valor.toUpperCase();
    }
    if (clave === 'salario') {
      return valor === '' ? Number.NaN : Number(valor);
    }
    return valor;
  }

  /**
   * @param {number} salario
   * @returns {string} El salario con separadores de miles, por ejemplo "$ 3.000.000".
   */
  #formatearSalario(salario) {
    return `$ ${salario.toLocaleString('es-CO')}`;
  }

  /** @param {string} texto */
  #titulo(texto) {
    this.#consola.escribir(`\n--- ${texto} ---`);
  }
}
