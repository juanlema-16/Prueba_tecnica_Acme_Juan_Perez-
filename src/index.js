import { EmpleadoRepository } from './repositories/EmpleadoRepository.js';
import { EmpleadoValidator } from './validators/EmpleadoValidator.js';
import { GeneradorId } from './utils/GeneradorId.js';
import { EmpleadoService } from './services/EmpleadoService.js';
import { Consola } from './ui/Consola.js';
import { EmpleadoView } from './ui/EmpleadoView.js';
import { Menu } from './ui/Menu.js';

/**
 * Punto de entrada y raíz de composición: el único lugar donde se crean
 * las dependencias y se conectan entre sí (inyección de dependencias).
 */
async function main() {
  const servicio = new EmpleadoService(
    new EmpleadoRepository(),
    new EmpleadoValidator(),
    new GeneradorId(),
  );
  const consola = new Consola();
  const menu = new Menu(consola, new EmpleadoView(consola), servicio);

  await menu.iniciar();
}

main().catch((error) => {
  console.error('Error fatal al iniciar la aplicación:', error.message);
  process.exitCode = 1;
});
