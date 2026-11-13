/**
 * Error base de la aplicación.
 * Todos los errores "esperados" (de negocio) heredan de esta clase.
 * Así la capa de UI puede distinguirlos de los errores inesperados (bugs).
 */
export class AppError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = this.constructor.name;
  }
}

/**
 * Se lanza cuando los datos de un empleado no cumplen las reaglas de negocio (RN-01 a RN-05).
 * Recibe un arreglo con TODOS los errores encontrados, no solo el primero.
 */
export class ValidationError extends AppError {
  constructor(errores = []) {
    super(`Datos inválidos:\n - ${errores.join('\n - ')}`);
    this.errores = errores;
  }
}

/**
 * Se lanza cuando se busca, actualiza o elimina un empleado que no existe.
 */
export class NotFoundError extends AppError {
  constructor(mensaje = 'El recurso solicitado no existe') {
    super(mensaje);
  }
}

/**
 * Se lanza cuando se intenta registrar un empleado con una identificación que ya existe.
 */
export class DuplicateError extends AppError {
  constructor(mensaje = 'El recurso ya existe') {
    super(mensaje);
  }
}
