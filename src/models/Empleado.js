/**
 * Modelo que representa a un empleado de ACME.
 * El identificador único (#id) es privado e inmutable: se asigna al crear
 * el empleado y no puede modificarse desde fuera de la clase.
 * Este modelo NO valida datos; esa responsabilidad es de EmpleadoValidator.
 */
export class Empleado {
  /** Lista de campos editables del empleado (todos excepto el id). */
  static CAMPOS = [
    'identificacion',
    'nombres',
    'apellidos',
    'genero',
    'email',
    'telefono',
    'direccion',
    'ciudad',
    'profesion',
    'cargo',
    'salario',
  ];

  #id;

  /**
   * @param {string} id - Identificador único generado por el sistema.
   * @param {object} datos - Datos del empleado.
   */
  constructor(id, datos) {
    this.#id = id;
    this.identificacion = datos.identificacion;
    this.nombres = datos.nombres;
    this.apellidos = datos.apellidos;
    this.genero = datos.genero;
    this.email = datos.email;
    this.telefono = datos.telefono;
    this.direccion = datos.direccion;
    this.ciudad = datos.ciudad;
    this.profesion = datos.profesion;
    this.cargo = datos.cargo;
    this.salario = datos.salario;
  }

  /** Permite leer el id, pero no modificarlo (no hay setter). */
  get id() {
    return this.#id;
  }

  /** Nombre completo, útil para mostrar en pantalla. */
  get nombreCompleto() {
    return `${this.nombres} ${this.apellidos}`;
  }

  /**
   * Actualiza solo los campos permitidos que vengan con valor.
   * Cualquier otra propiedad (incluido "id") se ignora.
   * @param {object} datos - Campos a modificar.
   */
  actualizar(datos) {
    for (const campo of Empleado.CAMPOS) {
      if (datos[campo] !== undefined) {
        this[campo] = datos[campo];
      }
    }
  }

  /**
   * Devuelve un objeto plano con todos los datos, incluido el id privado.
   * Los campos privados no aparecen en console.log ni en JSON.stringify,
   * por eso este método es necesario.
   */
  toJSON() {
    return { id: this.#id, ...this };
  }
}
