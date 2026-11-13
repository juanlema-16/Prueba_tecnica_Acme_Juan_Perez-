import { AppError } from '../errors/AppError.js';

/**
 * Menú interactivo principal. Muestra las opciones, ejecuta la elegida y
 * atrapa en un único lugar los errores de cualquier capa, para que la
 * aplicación nunca se cierre abruptamente.
 */
export class Menu {
  #consola;
  #vista;
  #servicio;
  #opciones;

  /**
   * @param {Consola} consola
   * @param {EmpleadoView} vista
   * @param {EmpleadoService} servicio
   */
  constructor(consola, vista, servicio) {
    this.#consola = consola;
    this.#vista = vista;
    this.#servicio = servicio;
    // Se usa Map porque respeta el orden de inserción ("0. Salir" al final);
    // un objeto literal ordenaría las claves numéricas de menor a mayor.
    this.#opciones = new Map([
      ['1', { texto: 'Registrar empleado', accion: () => this.#registrar() }],
      ['2', { texto: 'Listar empleados', accion: () => this.#listar() }],
      ['3', { texto: 'Buscar empleado por identificación', accion: () => this.#buscar() }],
      ['4', { texto: 'Actualizar empleado', accion: () => this.#actualizar() }],
      ['5', { texto: 'Eliminar empleado', accion: () => this.#eliminar() }],
      ['0', { texto: 'Salir', accion: null }],
    ]);
  }

  /** Inicia el ciclo del menú hasta que el usuario elija salir. */
  async iniciar() {
    this.#consola.escribir('\n=========================================');
    this.#consola.escribir('   ACME · Gestión de Empleados');
    this.#consola.escribir('=========================================');

    let continuar = true;
    while (continuar && !this.#consola.cerrada) {
      try {
        this.#mostrarOpciones();
        const opcion = await this.#consola.preguntar('Seleccione una opción: ');
        continuar = await this.#ejecutar(opcion);
      } catch (error) {
        if (this.#consola.cerrada) {
          break;
        }
        this.#manejarError(error);
      }
    }

    this.#consola.escribir('\n👋 Hasta luego.');
    this.#consola.cerrar();
  }

  #mostrarOpciones() {
    this.#consola.escribir('\n----------- MENÚ PRINCIPAL -----------');
    for (const [numero, { texto }] of this.#opciones) {
      this.#consola.escribir(`  ${numero}. ${texto}`);
    }
  }

  /**
   * Ejecuta la opción elegida.
   * @param {string} opcion
   * @returns {Promise<boolean>} false si el usuario eligió salir.
   */
  async #ejecutar(opcion) {
    const elegida = this.#opciones.get(opcion);
    if (!elegida) {
      this.#vista.mostrarError(`"${opcion}" no es una opción válida. Elija un número del 0 al 5.`);
      return true;
    }
    if (elegida.accion === null) {
      return false;
    }
    await elegida.accion();
    return true;
  }

  /** RF-01 */
  async #registrar() {
    const datos = await this.#vista.pedirDatos();
    const empleado = this.#servicio.registrar(datos);
    this.#vista.mostrarExito(`Empleado ${empleado.nombreCompleto} registrado con ID: ${empleado.id}`);
  }

  /** RF-02 */
  async #listar() {
    this.#vista.mostrarLista(this.#servicio.listar());
  }

  /** RF-03 */
  async #buscar() {
    this.#vista.mostrarTitulo('Buscar empleado');
    const identificacion = await this.#vista.pedirIdentificacion();
    const empleado = this.#servicio.buscarPorIdentificacion(identificacion);
    this.#vista.mostrarEmpleado(empleado);
  }

  /** RF-04 */
  async #actualizar() {
    this.#vista.mostrarTitulo('Actualizar empleado');
    const id = await this.#vista.pedirId();
    const empleado = this.#servicio.buscarPorId(id);
    this.#vista.mostrarEmpleado(empleado);

    const cambios = await this.#vista.pedirCambios(empleado);
    const actualizado = this.#servicio.actualizar(id, cambios);
    this.#vista.mostrarExito(`Empleado ${actualizado.nombreCompleto} actualizado correctamente.`);
  }

  /** RF-05 */
  async #eliminar() {
    this.#vista.mostrarTitulo('Eliminar empleado');
    const id = await this.#vista.pedirId();
    const empleado = this.#servicio.buscarPorId(id);
    this.#vista.mostrarEmpleado(empleado);

    const confirmado = await this.#vista.confirmar(`\n¿Seguro que desea eliminar a ${empleado.nombreCompleto}?`);
    if (!confirmado) {
      this.#vista.mostrarAviso('Eliminación cancelada.');
      return;
    }
    this.#servicio.eliminar(id);
    this.#vista.mostrarExito(`Empleado ${empleado.nombreCompleto} eliminado.`);
  }

  /**
   * Muestra los errores de negocio con su mensaje y oculta los detalles
   * técnicos de los errores inesperados. En ningún caso se cierra la app.
   * @param {Error} error
   */
  #manejarError(error) {
    if (error instanceof AppError) {
      this.#vista.mostrarError(error.message);
      return;
    }
    this.#vista.mostrarError('Ocurrió un error inesperado. Intente nuevamente.');
    console.error(`   Detalle técnico: ${error.message}`);
  }
}
