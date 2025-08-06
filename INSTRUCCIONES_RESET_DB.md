# Instrucciones para Restablecer la Base de Datos

Este documento proporciona los pasos necesarios para restablecer completamente la base de datos y configurar el usuario administrador.

## Pasos a seguir

### 1. Actualizar la estructura de la base de datos

Primero, necesitamos asegurarnos de que la estructura de la base de datos esté actualizada. Ejecute el siguiente comando para añadir columnas faltantes:

```bash
node updateDatabaseStructure.js
```

Este comando verificará y añadirá las siguientes columnas a las tablas `solicitudes_pago`, `solicitudes_viaticos` y `pagos_recurrentes` si no existen:

- `tipo_pago_descripcion`
- `empresa_a_pagar`
- `nombre_persona`
- `tipo_cuenta_destino`
- `tipo_tarjeta`
- `banco_destino`
- `fecha_pago`
- `id_pagador`
- `id_aprobador`

### 2. Restablecer todas las tablas de la base de datos

Ejecute el siguiente comando para eliminar todos los registros de todas las tablas:

```bash
node resetDatabase.js
```

Este comando vaciará las siguientes tablas:

- comprobantes_pago
- comprobantes_viaticos
- ejecuciones_recurrentes
- login_audit
- notificaciones
- pagos_recurrentes
- solicitudes_pago
- solicitudes_viaticos
- usuarios
- viatico_conceptos
- viaticos
- viaticos_detalle

### 3. Crear el usuario administrador

Una vez que la base de datos ha sido restablecida, puede crear el usuario administrador ejecutando:

```bash
node crearUsuario.js
```

Esto creará un usuario con las siguientes credenciales:

- **Email**: `enrique.bechapra@gmail.com`
- **Contraseña**: admin123
- **Rol**: admin_general

### Notas importantes

- Ejecute los scripts en el orden indicado.
- Asegúrese de que el servidor no esté en ejecución mientras realiza estos pasos.
- Después de completar estos pasos, puede iniciar el servidor nuevamente.
- Si necesita cambiar los datos del usuario administrador, puede editar el archivo `crearUsuario.js`.

## Solución de problemas

Si encuentra algún error durante el proceso:

1. Verifique que la base de datos esté activa y accesible.
2. Asegúrese de tener los permisos necesarios para modificar la base de datos.
3. Revise los mensajes de error para identificar el problema específico.
