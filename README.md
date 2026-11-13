# ACME · Gestión de Empleados

Aplicación de consola desarrollada con **Node.js** para que el área de Talento Humano de ACME gestione la lista de sus empleados.

> 🚧 Proyecto en desarrollo.

## Requisitos

- Node.js 18 o superior
- No requiere instalar dependencias (no usa librerías de terceros)

## Ejecución

```bash
npm start
```

## Funcionalidades

- RF-01: Registrar empleados
- RF-02: Listar empleados
- RF-03: Buscar empleado por identificación
- RF-04: Actualizar empleado por identificador único
- RF-05: Eliminar empleado por identificador único

## Estructura del proyecto

```
src/
├── errors/        Errores personalizados
├── models/        Entidades (Empleado)
├── validators/    Reglas de negocio
├── repositories/  Almacenamiento en memoria (arreglo)
├── services/      Lógica de negocio
├── utils/         Utilidades (generador de IDs)
└── ui/            Consola, vistas y menú interactivo
```

## Autor

Juan José Pérez Lema · [GitHub](https://github.com/juanlema-16)
