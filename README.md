# 📚 PSYMED API - Documentación de Endpoints

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Perfiles de Pacientes](#perfiles-de-pacientes)
3. [Perfiles de Profesionales](#perfiles-de-profesionales)
4. [Sesiones/Citas Médicas](#sesionescitas-médicas)
5. [Tareas](#tareas)
6. [Medicamentos](#medicamentos)
7. [Estado Emocional](#estado-emocional)
8. [Funciones Biológicas](#funciones-biológicas)
9. [Historia Clínica](#historia-clínica)
10. [Cuentas](#cuentas)

---

## 🔐 Autenticación

### Sign In (Iniciar Sesión)
```http
POST /api/v1/authentication/sign-in
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "string",
  "token": "jwt-token-string"
}
```

**Códigos de respuesta:**
- `200 OK` - Login exitoso
- `404 Not Found` - Usuario no encontrado o credenciales incorrectas

---

### Sign Up (Registrarse)
```http
POST /api/v1/authentication/sign-up
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "ROLE_PATIENT" // o "ROLE_PROFESSIONAL"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "string",
  "role": "string"
}
```

**Códigos de respuesta:**
- `201 Created` - Cuenta creada exitosamente
- `400 Bad Request` - Datos inválidos

---

## 👤 Perfiles de Pacientes

### Crear Perfil de Paciente
```http
POST /api/v1/patient-profiles
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "street": "string",
  "city": "string",
  "country": "string",
  "email": "string",
  "username": "string",
  "password": "string",
  "professionalId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "fullName": "string",
  "email": "string",
  "streetAddress": "string",
  "accountId": {
    "accountId": 1
  },
  "professionalId": 1
}
```

**Códigos de respuesta:**
- `201 Created` - Perfil creado exitosamente
- `400 Bad Request` - Email ya existe o datos inválidos

---

### Obtener Perfil de Paciente por ID
```http
GET /api/v1/patient-profiles/{profileId}
```

**Path Parameters:**
- `profileId` (Long) - ID del perfil del paciente

**Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "string",
  "email": "string",
  "streetAddress": "string",
  "accountId": {
    "accountId": 1
  },
  "professionalId": 1
}
```

**Códigos de respuesta:**
- `200 OK` - Perfil encontrado
- `404 Not Found` - Perfil no encontrado

---

### Obtener Perfil de Paciente por Account ID
```http
GET /api/v1/patient-profiles/account/{accountId}
```

**Path Parameters:**
- `accountId` (Long) - ID de la cuenta asociada

**Response:** Igual que el endpoint anterior

---

### Obtener Pacientes por Professional ID
```http
GET /api/v1/patient-profiles/professional/{professionalId}
```

**Path Parameters:**
- `professionalId` (Long) - ID del profesional

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "fullName": "string",
    "email": "string",
    "streetAddress": "string",
    "accountId": {
      "accountId": 1
    },
    "professionalId": 1
  }
]
```

**Códigos de respuesta:**
- `200 OK` - Lista de pacientes encontrada
- `404 Not Found` - No se encontraron pacientes

---

### Obtener Todos los Perfiles de Pacientes
```http
GET /api/v1/patient-profiles
```

**Response (200 OK):** Array de perfiles de pacientes

---

### Actualizar Perfil de Paciente ⭐ NUEVO
```http
PUT /api/v1/patient-profiles/{profileId}
```

**Path Parameters:**
- `profileId` (Long) - ID del perfil a actualizar

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "street": "string",
  "city": "string",
  "country": "string",
  "email": "string"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos enviados.

**Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "string",
  "email": "string",
  "streetAddress": "string",
  "accountId": {
    "accountId": 1
  },
  "professionalId": 1
}
```

**Códigos de respuesta:**
- `200 OK` - Perfil actualizado exitosamente
- `400 Bad Request` - Email ya existe o datos inválidos
- `404 Not Found` - Perfil no encontrado

---

### Eliminar Perfil de Paciente ⭐ NUEVO
```http
DELETE /api/v1/patient-profiles/{profileId}
```

**Path Parameters:**
- `profileId` (Long) - ID del perfil a eliminar

**Response (204 No Content):** Sin contenido

**Códigos de respuesta:**
- `204 No Content` - Perfil eliminado exitosamente
- `404 Not Found` - Perfil no encontrado

---

## 👨‍⚕️ Perfiles de Profesionales

### Crear Perfil de Profesional
```http
POST /api/v1/professional-profiles
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "street": "string",
  "city": "string",
  "country": "string",
  "email": "string",
  "username": "string",
  "password": "string"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "fullName": "string",
  "email": "string",
  "streetAddress": "string",
  "accountId": {
    "accountId": 1
  },
  "professionalId": null
}
```

---

### Obtener Perfil de Profesional por ID
```http
GET /api/v1/professional-profiles/{profileId}
```

**Path Parameters:**
- `profileId` (Long) - ID del perfil del profesional

**Response (200 OK):** Igual que el response de crear

---

### Obtener Perfil de Profesional por Account ID
```http
GET /api/v1/professional-profiles/account/{accountId}
```

**Path Parameters:**
- `accountId` (Long) - ID de la cuenta asociada

**Response (200 OK):** Igual que el response de crear

---

## 📅 Sesiones/Citas Médicas

### Crear Sesión (Por Profesional)
```http
POST /api/v1/professionals/{professionalId}/patients/{patientId}/sessions
```

**Path Parameters:**
- `professionalId` (Long) - ID del profesional
- `patientId` (Long) - ID del paciente

**Request Body:**
```json
{
  "appointmentDate": "2024-12-31T10:00:00.000Z",
  "sessionTime": 1.5
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "patientId": 1,
  "professionalId": 1,
  "appointmentDate": "2024-12-31T10:00:00.000Z",
  "sessionTime": 1.5
}
```

**Códigos de respuesta:**
- `201 Created` - Sesión creada exitosamente
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Paciente o profesional no encontrado

---

### Obtener Sesiones de un Paciente
```http
GET /api/v1/patients/{patientId}/sessions
```

**Path Parameters:**
- `patientId` (String) - ID del paciente

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "patientId": 1,
    "professionalId": 1,
    "appointmentDate": "2024-12-31T10:00:00.000Z",
    "sessionTime": 1.5
  }
]
```

**Códigos de respuesta:**
- `200 OK` - Sesiones encontradas
- `404 Not Found` - No se encontraron sesiones

---

### Obtener Sesiones de un Profesional
```http
GET /api/v1/professionals/{professionalId}/sessions
```

**Path Parameters:**
- `professionalId` (String) - ID del profesional

**Response (200 OK):** Array de sesiones (igual formato que el endpoint anterior)

---

## ✅ Tareas

### Agregar Nota a Sesión (Solo visible para el doctor)
```http
POST /api/v1/sessions/{sessionId}/notes
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string"
}
```

**Códigos de respuesta:**
- `201 Created` - Nota agregada exitosamente
- `400 Bad Request` - La sesión ya tiene una nota o datos inválidos
- `404 Not Found` - Sesión no encontrada

---

### Agregar Tarea a Sesión
```http
POST /api/v1/sessions/{sessionId}/tasks
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response (201 Created):**
```json
{
  "taskId": 1,
  "title": "string",
  "description": "string",
  "status": 0
}
```

**Nota:** `status` = 0 (no completada), 1 (completada)

**Códigos de respuesta:**
- `201 Created` - Tarea creada exitosamente
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Sesión no encontrada

---

### Obtener Tareas de una Sesión
```http
GET /api/v1/sessions/{sessionId}/tasks
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión

**Response (200 OK):**
```json
[
  {
    "taskId": 1,
    "title": "string",
    "description": "string",
    "status": 0
  }
]
```

---

### Obtener Todas las Tareas de un Paciente ⭐ NUEVO
```http
GET /api/v1/patients/{patientId}/tasks
```

**Path Parameters:**
- `patientId` (String) - ID del paciente

**Response (200 OK):**
```json
[
  {
    "taskId": 1,
    "title": "string",
    "description": "string",
    "status": 0
  }
]
```

**Descripción:** Retorna todas las tareas del paciente a través de todas sus sesiones.

**Códigos de respuesta:**
- `200 OK` - Tareas encontradas
- `404 Not Found` - No se encontraron tareas

---

### Marcar Tarea como Completada
```http
POST /api/v1/sessions/{sessionId}/tasks/{taskId}/complete
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión
- `taskId` (Long) - ID de la tarea

**Response (200 OK):**
```json
"Task status updated to complete"
```

**Códigos de respuesta:**
- `200 OK` - Tarea marcada como completada
- `400 Bad Request` - Error al actualizar
- `404 Not Found` - Sesión o tarea no encontrada

---

### Actualizar Tarea ⭐ NUEVO
```http
PUT /api/v1/sessions/{sessionId}/tasks/{taskId}
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión
- `taskId` (Long) - ID de la tarea

**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Nota:** Ambos campos son opcionales. Solo se actualizarán los campos enviados.

**Response (200 OK):**
```json
{
  "taskId": 1,
  "title": "string",
  "description": "string",
  "status": 0
}
```

**Códigos de respuesta:**
- `200 OK` - Tarea actualizada exitosamente
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Sesión o tarea no encontrada

---

### Eliminar Tarea ⭐ NUEVO
```http
DELETE /api/v1/sessions/{sessionId}/tasks/{taskId}
```

**Path Parameters:**
- `sessionId` (Long) - ID de la sesión
- `taskId` (Long) - ID de la tarea

**Response (204 No Content):** Sin contenido

**Códigos de respuesta:**
- `204 No Content` - Tarea eliminada exitosamente
- `400 Bad Request` - Error al eliminar
- `404 Not Found` - Sesión o tarea no encontrada

---

## 💊 Medicamentos

### Crear Medicamento
```http
POST /api/v1/pills
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "patientId": 1,
  "interval": "string",
  "quantity": "string"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "patientId": 1,
  "interval": "string",
  "quantity": "string"
}
```

**Códigos de respuesta:**
- `201 Created` - Medicamento creado exitosamente
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Error al crear

---

### Obtener Todos los Medicamentos
```http
GET /api/v1/pills
```

**Response (200 OK):** Array de medicamentos

---

### Obtener Medicamentos por Paciente
```http
GET /api/v1/pills/patient/{patientId}
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "string",
    "description": "string",
    "patientId": 1,
    "interval": "string",
    "quantity": "string"
  }
]
```

**Códigos de respuesta:**
- `200 OK` - Medicamentos encontrados
- `404 Not Found` - No se encontraron medicamentos

---

### Eliminar Medicamento
```http
DELETE /api/v1/pills/{pillId}
```

**Path Parameters:**
- `pillId` (Long) - ID del medicamento

**Response (200 OK):**
```json
"Medication with given id successfully deleted"
```

**Códigos de respuesta:**
- `200 OK` - Medicamento eliminado exitosamente
- `404 Not Found` - Medicamento no encontrado

---

## 😊 Estado Emocional

### Registrar Estado Emocional
```http
POST /api/v1/patients/{patientId}/mood-states
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Request Body:**
```json
{
  "mood": "string",
  "date": "2024-12-31T10:00:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "patientId": 1,
  "mood": "string",
  "date": "2024-12-31T10:00:00.000Z"
}
```

**Códigos de respuesta:**
- `201 Created` - Estado emocional registrado exitosamente
- `400 Bad Request` - Datos inválidos

---

### Obtener Estados Emocionales por Paciente
```http
GET /api/v1/patients/{patientId}/mood-states
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "patientId": 1,
    "mood": "string",
    "date": "2024-12-31T10:00:00.000Z"
  }
]
```

---

## 🏥 Funciones Biológicas

### Registrar Función Biológica
```http
POST /api/v1/patients/{patientId}/biological-functions
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Request Body:**
```json
{
  "functionType": "string",
  "value": "string",
  "date": "2024-12-31T10:00:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "patientId": 1,
  "functionType": "string",
  "value": "string",
  "date": "2024-12-31T10:00:00.000Z"
}
```

**Códigos de respuesta:**
- `201 Created` - Función biológica registrada exitosamente
- `400 Bad Request` - Datos inválidos

---

### Obtener Funciones Biológicas por Paciente
```http
GET /api/v1/patients/{patientId}/biological-functions
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "patientId": 1,
    "functionType": "string",
    "value": "string",
    "date": "2024-12-31T10:00:00.000Z"
  }
]
```

---

## 📋 Historia Clínica

### Obtener Historia Clínica por Paciente
```http
GET /api/v1/patients/{patientId}/clinical-histories
```

**Path Parameters:**
- `patientId` (Long) - ID del paciente

**Response (200 OK):**
```json
{
  "id": 1,
  "patientId": 1,
  "background": "string",
  "consultationReason": "string",
  "consultationDate": "2024-12-31T10:00:00.000Z"
}
```

**Códigos de respuesta:**
- `200 OK` - Historia clínica encontrada
- `404 Not Found` - Historia clínica no encontrada

---

## 👥 Cuentas

### Obtener Cuenta por ID
```http
GET /api/v1/accounts/{accountId}
```

**Path Parameters:**
- `accountId` (Long) - ID de la cuenta

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "string",
  "role": "string"
}
```

**Códigos de respuesta:**
- `200 OK` - Cuenta encontrada
- `404 Not Found` - Cuenta no encontrada

---

## 📝 Notas Importantes

### Autenticación
- La mayoría de los endpoints requieren autenticación mediante JWT token
- El token se obtiene del endpoint `/api/v1/authentication/sign-in`
- El token debe enviarse en el header: `Authorization: Bearer {token}`

### Roles
- `ROLE_PATIENT` - Paciente
- `ROLE_PROFESSIONAL` - Doctor/Profesional

### Formato de Fechas
- Todas las fechas se manejan en formato ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Ejemplo: `2024-12-31T10:00:00.000Z`

### Estados de Tareas
- `0` - No completada
- `1` - Completada

### Códigos de Estado HTTP Comunes
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Operación exitosa sin contenido de respuesta
- `400 Bad Request` - Datos inválidos en la solicitud
- `404 Not Found` - Recurso no encontrado

### ⭐ Nuevas Funcionalidades Implementadas
1. **CRUD completo de perfiles de pacientes** - UPDATE y DELETE
2. **CRUD completo de tareas** - UPDATE y DELETE
3. **Endpoint para obtener todas las tareas de un paciente** - Facilita la visualización en el frontend
4. **Notas en sesiones** - Ya estaba implementado, visible solo para doctores

---

## 🚀 Base URL

```
http://localhost:{puerto}/
```

**Nota:** Reemplaza `{puerto}` con el puerto en el que esté corriendo el backend (generalmente 8080).

---

## 💡 Ejemplos de Uso

### Ejemplo: Login y crear sesión

```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:8080/api/v1/authentication/sign-in', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'doctor@example.com',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// 2. Crear sesión
const sessionResponse = await fetch('http://localhost:8080/api/v1/professionals/1/patients/2/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    appointmentDate: '2024-12-31T10:00:00.000Z',
    sessionTime: 1.5
  })
});

const session = await sessionResponse.json();
```

---

**Última actualización:** Diciembre 2024  
**Versión API:** v1

