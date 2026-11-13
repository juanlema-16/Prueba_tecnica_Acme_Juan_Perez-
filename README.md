# ACME · Gestión de Empleados

Aplicación de consola desarrollada con **Node.js** para que el área de Talento Humano de ACME gestione la lista de sus empleados.

Está construida con **Programación Orientada a Objetos**, principios **SOLID**, **ES Modules** y **sin librerías de terceros**. Los datos se guardan en memoria, en un arreglo.

## Requisitos

- Node.js 18 o superior
- No requiere instalar dependencias

## Ejecución

```bash
git clone https://github.com/juanlema-16/Prueba_tecnica_Acme_Juan_Perez-.git
cd Prueba_tecnica_Acme_Juan_Perez-
npm start
```

También se puede ejecutar con `node src/index.js`.

> Los datos viven en memoria: al cerrar la aplicación se pierden. Así lo pide el enunciado (sin base de datos).

## Uso

```
----------- MENÚ PRINCIPAL -----------
  1. Registrar empleado
  2. Listar empleados
  3. Buscar empleado por identificación
  4. Actualizar empleado
  5. Eliminar empleado
  0. Salir
Seleccione una opción:
```

- **Registrar:** pide los 11 datos del empleado y le asigna un **ID único** (UUID).
- **Listar:** muestra una tabla con el ID único, la identificación, el nombre, el cargo y el salario.
- **Buscar:** pide la **identificación** (por ejemplo, la cédula) y muestra el detalle completo.
- **Actualizar:** pide el **ID único** (se copia desde el listado). En cada campo se puede presionar Enter para conservar el valor actual.
- **Eliminar:** pide el **ID único**, muestra el empleado y pide confirmación antes de eliminarlo.

## Requerimientos funcionales

| Código | Descripción | Implementación |
|---|---|---|
| RF-01 | Registrar empleados con ID único | `EmpleadoService.registrar` + `GeneradorId` |
| RF-02 | Listar empleados | `EmpleadoService.listar` |
| RF-03 | Buscar por identificación | `EmpleadoService.buscarPorIdentificacion` |
| RF-04 | Actualizar por ID único | `EmpleadoService.actualizar` |
| RF-05 | Eliminar por ID único | `EmpleadoService.eliminar` |

## Reglas de negocio

Se validan en `EmpleadoValidator`. Si hay errores, se muestran **todos juntos** en un solo mensaje.

| Código | Regla |
|---|---|
| RN-01 | Nombres y apellidos no pueden estar vacíos (tampoco solo espacios) |
| RN-02 | Género debe ser `M`, `F` u `O` (se acepta en minúscula) |
| RN-03 | Email, teléfono, dirección y ciudad de residencia son obligatorios |
| RN-04 | Profesión y cargo son obligatorios |
| RN-05 | El salario debe ser un número mayor a 0 |

**Reglas adicionales (decisiones de diseño):**
- La identificación es obligatoria y **no puede repetirse**, porque representa a una persona real y es la clave de búsqueda de RF-03.
- En una actualización se validan los datos finales **antes** de modificar al empleado, para que nunca quede en un estado inválido.

## Arquitectura

```
src/
├── index.js                          Punto de entrada: crea y conecta las dependencias
├── errors/AppError.js                Jerarquía de errores: AppError, ValidationError, NotFoundError, DuplicateError
├── models/Empleado.js                Entidad Empleado con #id privado e inmutable
├── validators/EmpleadoValidator.js   Reglas de negocio RN-01 a RN-05
├── repositories/EmpleadoRepository.js  Almacenamiento en memoria (arreglo privado)
├── services/EmpleadoService.js       Casos de uso RF-01 a RF-05
├── utils/GeneradorId.js              IDs únicos con node:crypto (randomUUID)
└── ui/
    ├── Consola.js                    Envoltorio de node:readline
    ├── EmpleadoView.js               Captura y presentación de datos
    └── Menu.js                       Menú interactivo y manejo centralizado de errores
```

Flujo de una operación:

```
Menu ──▶ EmpleadoView (pide datos) ──▶ EmpleadoService ──▶ EmpleadoValidator
                                              │         ──▶ GeneradorId
                                              └────────▶ EmpleadoRepository ──▶ [ arreglo ]
```

### Principios SOLID aplicados

- **S (responsabilidad única):** cada clase tiene una sola tarea. El modelo representa datos, el validador aplica reglas, el repositorio guarda, el servicio orquesta y la UI interactúa con el usuario.
- **O (abierto/cerrado):** se pueden agregar errores o reglas nuevas sin modificar las clases existentes.
- **L (sustitución de Liskov):** cualquier subclase de `AppError` puede usarse donde se espera un `AppError`.
- **I (segregación de interfaces):** clases pequeñas con métodos enfocados.
- **D (inversión de dependencias):** `EmpleadoService` recibe repositorio, validador y generador de IDs por constructor. Para usar una base de datos solo habría que crear otro repositorio con los mismos métodos.

### Manejo de errores

- Las capas internas **lanzan** errores con nombre propio (`ValidationError`, `NotFoundError`, `DuplicateError`).
- `Menu` los **atrapa en un único lugar**: muestra el mensaje y vuelve al menú, así que la aplicación **nunca se cierra abruptamente**.
- Los errores inesperados muestran un mensaje genérico y la aplicación sigue funcionando.
- Cerrar la entrada (Ctrl + C) termina la aplicación de forma ordenada.

## Flujo de trabajo con Git

- **Conventional Commits** (`feat`, `fix`, `docs`, `chore`...).
- Ramas: `main` (versiones estables), `develop` (integración) y `feature/*`, `docs/*`, `chore/*` por cada cambio, integradas con `merge --no-ff`.

## Autor

Juan José Pérez Lema · [GitHub](https://github.com/juanlema-16)
