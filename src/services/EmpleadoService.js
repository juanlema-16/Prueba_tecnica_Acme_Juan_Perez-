import { Empleado } from '../models/Empleado.js';
import { DuplicateError, NotFoundError } from '../errors/AppError.js';

/**
 * Casos de uso de la gestión de empleados (RF-01 a RF-05).
 * Orquesta validador, repositorio y generador de IDs, que recibe por
 * inyección de dependencias: el servicio no sabe cómo se guardan los datos
 * ni cómo se generan los IDs, solo usa sus métodos.
 */
export class EmpleadoService {
  #repositorio;
  #validador;
  #generadorId;

  /**
   * @param {EmpleadoRepository} repositorio - Almacenamiento de empleados.
   * @param {EmpleadoValidator} validador - Reglas de negocio.
   * @param {GeneradorId} generadorId - Generador de identificadores únicos.
   */
  constructor(repositorio, validador, generadorId) {
    this.#repositorio = repositorio;
    this.#validador = validador;
    this.#generadorId = generadorId;
  }

  /**
   * RF-01: registra un empleado nuevo con un identificador único.
   * @param {object} datos
   * @returns {Empleado}
   * @throws {ValidationError} Si los datos no cumplen las reglas de negocio.
   * @throws {DuplicateError} Si ya existe un empleado con esa identificación.
   */
  registrar(datos) {
    this.#validador.validar(datos);
    this.#verificarIdentificacionDisponible(datos.identificacion);

    const empleado = new Empleado(this.#generadorId.generar(), datos);
    return this.#repositorio.guardar(empleado);
  }

  /**
   * RF-02: lista todos los empleados registrados.
   * @returns {Empleado[]}
   */
  listar() {
    return this.#repositorio.obtenerTodos();
  }

  /**
   * RF-03: busca un empleado por su número de identificación.
   * @param {string} identificacion
   * @returns {Empleado}
   * @throws {NotFoundError}
   */
  buscarPorIdentificacion(identificacion) {
    const empleado = this.#repositorio.buscarPorIdentificacion(identificacion);
    if (!empleado) {
      throw new NotFoundError(`No existe un empleado con la identificación "${identificacion}".`);
    }
    return empleado;
  }

  /**
   * Busca un empleado por su identificador único (usado por RF-04 y RF-05).
   * @param {string} id
   * @returns {Empleado}
   * @throws {NotFoundError}
   */
  buscarPorId(id) {
    const empleado = this.#repositorio.buscarPorId(id);
    if (!empleado) {
      throw new NotFoundError(`No existe un empleado con el ID "${id}".`);
    }
    return empleado;
  }

  /**
   * RF-04: actualiza los datos de un empleado dado su identificador único.
   * Solo se modifican los campos que vengan con valor; el resultado completo
   * se valida ANTES de modificar el empleado, para no dejarlo en un estado inválido.
   * @param {string} id
   * @param {object} cambios - Campos a modificar.
   * @returns {Empleado}
   * @throws {NotFoundError | ValidationError | DuplicateError}
   */
  actualizar(id, cambios) {
    const empleado = this.buscarPorId(id);
    const cambiosConValor = Object.fromEntries(
      Object.entries(cambios).filter(([, valor]) => valor !== undefined),
    );
    const datosFinales = { ...empleado.toJSON(), ...cambiosConValor };

    this.#validador.validar(datosFinales);
    this.#verificarIdentificacionDisponible(datosFinales.identificacion, id);

    empleado.actualizar(cambiosConValor);
    return this.#repositorio.actualizar(empleado);
  }

  /**
   * RF-05: elimina un empleado dado su identificador único.
   * @param {string} id
   * @returns {Empleado} El empleado eliminado.
   * @throws {NotFoundError}
   */
  eliminar(id) {
    const empleado = this.buscarPorId(id);
    this.#repositorio.eliminar(id);
    return empleado;
  }

  /**
   * Verifica que ningún otro empleado tenga la misma identificación.
   * @param {string} identificacion
   * @param {string|null} idPropio - ID del empleado que se actualiza (se excluye).
   * @throws {DuplicateError}
   */
  #verificarIdentificacionDisponible(identificacion, idPropio = null) {
    const existente = this.#repositorio.buscarPorIdentificacion(identificacion);
    if (existente && existente.id !== idPropio) {
      throw new DuplicateError(
        `Ya existe un empleado registrado con la identificación "${identificacion}".`,
      );
    }
  }
}
