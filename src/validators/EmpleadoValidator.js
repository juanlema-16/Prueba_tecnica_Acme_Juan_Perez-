import { ValidationError } from '../errors/AppError.js';

/**
 * Valida los datos de un empleado según las reglas de negocio RN-01 a RN-05.
 * Reúne TODOS los errores encontrados y, si hay al menos uno,
 * lanza un ValidationError con la lista completa.
 */
export class EmpleadoValidator {
  /** Valores permitidos para el género (RN-02). */
  static GENEROS_VALIDOS = ['M', 'F', 'O'];

  /** Campos de contacto obligatorios (RN-03) con su mensaje de error. */
  static CAMPOS_CONTACTO = {
    email: 'El email es obligatorio.',
    telefono: 'El teléfono es obligatorio.',
    direccion: 'La dirección es obligatoria.',
    ciudad: 'La ciudad de residencia es obligatoria.',
  };

  /**
   * Valida los datos completos de un empleado.
   * @param {object} datos - Datos del empleado a validar.
   * @throws {ValidationError} Si alguna regla de negocio no se cumple.
   */
  validar(datos) {
    const errores = [];

    // Identificación obligatoria (necesaria para RF-03 y para evitar duplicados).
    if (this.#estaVacio(datos.identificacion)) {
      errores.push('La identificación es obligatoria.');
    }

    // RN-01: nombres y apellidos no vacíos.
    if (this.#estaVacio(datos.nombres)) {
      errores.push('Los nombres no pueden estar vacíos.');
    }
    if (this.#estaVacio(datos.apellidos)) {
      errores.push('Los apellidos no pueden estar vacíos.');
    }

    // RN-02: género debe ser M, F u O.
    if (!EmpleadoValidator.GENEROS_VALIDOS.includes(datos.genero)) {
      errores.push('El género debe ser "M", "F" u "O".');
    }

    // RN-03: datos de contacto obligatorios.
    for (const [campo, mensaje] of Object.entries(EmpleadoValidator.CAMPOS_CONTACTO)) {
      if (this.#estaVacio(datos[campo])) {
        errores.push(mensaje);
      }
    }

    // RN-04: profesión y cargo obligatorios.
    if (this.#estaVacio(datos.profesion)) {
      errores.push('La profesión es obligatoria.');
    }
    if (this.#estaVacio(datos.cargo)) {
      errores.push('El cargo es obligatorio.');
    }

    // RN-05: salario mayor a 0.
    if (!Number.isFinite(datos.salario) || datos.salario <= 0) {
      errores.push('El salario debe ser un número mayor a 0.');
    }

    if (errores.length > 0) {
      throw new ValidationError(errores);
    }
  }

  /**
   * Indica si un valor está vacío: no es texto, o es texto con solo espacios.
   * @param {*} valor
   * @returns {boolean}
   */
  #estaVacio(valor) {
    return typeof valor !== 'string' || valor.trim() === '';
  }
}
