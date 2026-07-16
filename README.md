## 1. Arquitectura de Software por Capas

El diseño de la aplicación sigue una arquitectura estructurada por capas independientes con separación estricta de responsabilidades (*Separation of Concerns*). Cada capa interactúa únicamente con su nivel inmediato inferior, asegurando desacoplamiento, facilidad para pruebas unitarias y escalabilidad técnica.

### Diagrama Arquitectónico Textual

```text
       ┌─────────────────────────────────────────────────────────┐
       │                   Cliente (Frontend)                    │
       └────────────────────────────┬────────────────────────────┘
                                    │  Petición HTTP (Request)
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                      Capa de Rutas                      │ (src/routes)
       │  - Intercepta el verbo HTTP (GET, POST, PUT).          │
       │  - Orquesta el orden de ejecución de middlewares.       │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   Capa de Middlewares                   │ (src/middlewares)
       │  - Validación de campos requeridos y formatos.          │
       │  - Intercepción y validación criptográfica de JWT.      │
       └────────────────────────────┬────────────────────────────┘
                                    │  Petición Autenticada y Validada
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   Capa de Controladores                 │ (src/controllers)
       │  - Recibe el control de la petición.                    │
       │  - Gestiona códigos de estado y respuestas JSON.        │
       │  - Encapsula llamadas a la capa de negocio (Servicios). │
       └────────────────────────────┬────────────────────────────┘
                                    │  Invocación de Negocio
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                    Capa de Servicios                    │ (src/services)
       │  - Concentra las reglas y lógica del negocio.           │
       │  - Abstrae el manejo de persistencia hacia la base.     │
       └────────────────────────────┬────────────────────────────┘
                                    │  Instanciación y Conexión de Clientes
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │               Capa de Acceso a Datos (DB)               │ (src/config/db.js)
       │  - Configura el pool de conexión con variables de env.  │
       │  - Retorna parámetros de inicialización del pool/client.│
       └────────────────────────────┬────────────────────────────┘
                                    │  Consultas SQL directas (pg)
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             Base de Datos Relacional (PostgreSQL)       │
       └─────────────────────────────────────────────────────────┘
```

### Descripción Detallada del Flujo de Ejecución por Capas

1.  **Capa de Rutas (`src/routes/`)**:
    Implementada mediante `Router` de Express. Divide la lógica de direccionamiento en módulos lógicos: `auth.js`, `posts.js` y `users.js`. Asocia rutas a controladores e inyecta middlewares específicos de manera secuencial.
2.  **Capa de Middlewares (`src/middlewares/`)**:
    *   **Seguridad**: `authMiddleware.js` detiene el flujo si el token no es provisto, tiene formato inadecuado o si la firma digital no es válida.
    *   **Validación**: `valUser.js`, `valRegister.js` y `valPost.js` procesan los datos del cuerpo de la petición (`req.body`) y aseguran que cumplan con criterios mínimos (como que los campos de registro contengan texto y que el email posea un patrón válido `@`) antes de llegar al controlador, previniendo inserciones inválidas.
3.  **Capa de Controladores (`src/controllers/`)**:
    Los controladores (`authController.js`, `postController.js`, `userController.js`) extraen información de la petición (`req.body`, `req.user`, parámetros), delegan el procesamiento pesado a los servicios correspondientes y retornan la respuesta HTTP estructurada con su respectivo código de estado (por ejemplo, `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized` o `500 Internal Server Error`).
4.  **Capa de Servicios (`src/services/`)**:
    Nuestros servicios (`authService.js`, `postService.js`, `userService.js`) encapsulan la interacción directa con PostgreSQL. Crean conexiones individuales con el cliente `pg`, parametrizan queries SQL para prevenir ataques de **Inyección SQL** (`$1, $2, etc.`), manipulan las filas resultantes y retornan objetos limpios de negocio.
5.  **Helpers (`src/helpers/`)**:
    Herramientas de soporte transversales. `valHelpers.js` asiste en comprobaciones de tipo de datos y `logHelper.js` gestiona un registro de errores estructurado (`archivo.log` / `debug.log`) guardando la marca de tiempo, mensaje del error y el stack trace completo si la configuración de variables de entorno está activa.

---

## 2. Estructura de Base de Datos y Relaciones SQL

El esquema físico de base de datos relacional PostgreSQL consta de dos tablas principales relacionadas con un esquema de integridad referencial estricto.

```text
    ┌────────────────────────┐                    ┌────────────────────────┐
    │       Usuarios         │                    │     Publicaciones      │
    ├────────────────────────┤                    ├────────────────────────┤
    │ PK  id (serial)        │───┐ 1        * ┌──>│ PK  id (serial)        │
    │     username (varchar) │   └────────────┘   │     url_image (varchar)│
    │     fullname (varchar) │                    │     description (text) │
    │     email (varchar)    │                    │     likes (integer)    │
    │     password (varchar) │                    │     creation:date (tz) │
    │     pfp (varchar)      │                    │ FK  user_id (integer)  │
    │     bio (text)         │                    └────────────────────────┘
    └────────────────────────┘
```

#### Detalles de Integridad y Relaciones:
*   **Relación**: `Publicaciones.user_id` referencia a `Usuarios.id` (Relación Uno a Muchos).
*   **Eliminación en Cascada (`ON DELETE CASCADE`)**: Si un registro de la tabla `Usuarios` es removido, todas sus publicaciones asociadas en `Publicaciones` se eliminarán automáticamente, garantizando la consistencia y evitando registros huérfanos.

---

## 3. Listado Completo de Endpoints de la API

La API maneja tres módulos principales bajo los prefijos `/api/auth`, `/api/posts`, y `/api/usuarios`.

---

### Módulo: Autenticación (`/api/auth`)

#### 1. Registrar Nuevo Usuario
*   **Método:** `POST`
*   **Ruta:** `/api/auth/register`
*   **Acceso:** **Público**
*   **Middlewares aplicados:** `validateRegister` (comprueba campos requeridos y estructura del email).
*   **JSON Esperado (Body):**
    ```json
    {
      "username": "jazarbe",
      "fullname": "Jazmin Arias",
      "email": "jazmin@gmail.com",
      "password": "password desencriptado", // se encripta antes de ingresarla en la DB
      "pfp": "default.jpg",
      "bio": "Mi biografía de prueba"
    }
    ```
*   **JSON Devuelto en Respuesta Exitosa (Status `201 Created`):**
    ```json
    {
      "message": "Usuario registrado con éxito",
      "user": {
        "id": 1,
        "username": "jazarbe",
        "email": "jazmin@gmail.com"
      }
    }
    ```

#### 2. Inicio de Sesión
*   **Método:** `POST`
*   **Ruta:** `/api/auth/login`
*   **Acceso:** **Público**
*   **Middlewares aplicados:** `validateUser` (comprueba que se ingresen las credenciales).
*   **JSON Esperado (Body):**
    ```json
    {
      "username": "jazarbe",
      "password": "password desencriptado" // tal como lo ingresa el usuario, luego se compara en el controller con la password encriptada de la DB
    }
    ```
*   **JSON Devuelto en Respuesta Exitosa (Status `200 OK`):**
    ```json
    {
      "message": "Login successful",
      "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "jazarbe",
        "fullname": "Jazmin Arias",
        "email": "jazmin@gmail.com",
        "pfp": "default.jpg",
        "bio": "Mi biografía de prueba"
      }
    }
    ```

---

### Módulo: Publicaciones (`/api/posts`)

#### 3. Listar Todas las Publicaciones (Feed)
*   **Método:** `GET`
*   **Ruta:** `/api/posts`
*   **Acceso:** **Público**
*   **Middlewares aplicados:** Ninguno.
*   **JSON Devuelto en Respuesta Exitosa (Status `200 OK`):**
    ```json
    [
      {
        "id": 1,
        "user_id": 1,
        "url_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g",
        "description": "first post",
        "likes": 0,
        "creation:date": "2026-07-16T14:51:23.276Z",
        "username": "jazarbe",
        "user_pfp": "default.jpg"
      }
    ]
    ```

#### 4. Crear Publicación
*   **Método:** `POST`
*   **Ruta:** `/api/posts`
*   **Acceso:** **Protegido** (Requiere Cabecera `Authorization: Bearer <token>`)
*   **Middlewares aplicados:** `authMiddleware`, `validatePost`.
*   **JSON Esperado (Body):**
    ```json
    {
      "url_image": "https://imgur.com/foto_nueva.png",
      "description": "Descripción de mi nueva foto"
    }
    ```
*   **JSON Devuelto en Respuesta Exitosa (Status `201 Created`):**
    ```json
    {
      "message": "Publicación creada con éxito",
      "post": {
        "id": 2,
        "url_image": "https://imgur.com/foto_nueva.png",
        "description": "Descripción de mi nueva foto",
        "likes": 0,
        "creation:date": "2026-07-16T15:00:00.000Z",
        "user_id": 1
      }
    }
    ```

---

### Módulo: Usuarios (`/api/usuarios`)

#### 5. Obtener Perfil de Usuario con Publicaciones Propias
*   **Método:** `GET`
*   **Ruta:** `/api/usuarios/perfil`
*   **Acceso:** **Protegido** (Requiere Cabecera `Authorization: Bearer <token>`)
*   **Middlewares aplicados:** `authMiddleware`.
*   **JSON Devuelto en Respuesta Exitosa (Status `200 OK`):**
    ```json
    {
      "id": 1,
      "username": "jazarbe",
      "fullname": "Jazmin Arias",
      "email": "jazmin@gmail.com",
      "pfp": "default.jpg",
      "bio": "Mi biografía de prueba",
      "publications": [
        {
          "id": 2,
          "url_image": "https://imgur.com/foto_nueva.png",
          "description": "Descripción de mi nueva foto",
          "likes": 0,
          "creation:date": "2026-07-16T15:00:00.000Z"
        }
      ]
    }
    ```

#### 6. Actualizar Información de Perfil
*   **Método:** `PUT`
*   **Ruta:** `/api/usuarios/perfil`
*   **Acceso:** **Protegido** (Requiere Cabecera `Authorization: Bearer <token>`)
*   **Middlewares aplicados:** `authMiddleware`.
*   **JSON Esperado (Body):**
    ```json
    {
      "fullname": "Jazmin Arias Actualizado",
      "bio": "Nueva descripción de bio profesional",
      "pfp": "perfil_actualizado.jpg"
    }
    ```
*   **JSON Devuelto en Respuesta Exitosa (Status `200 OK`):**
    ```json
    {
      "message": "Perfil actualizado con éxito",
      "user": {
        "id": 1,
        "username": "jazarbe",
        "fullname": "Jazmin Arias Actualizado",
        "email": "jazmin@gmail.com",
        "pfp": "perfil_actualizado.jpg",
        "bio": "Nueva descripción de bio profesional"
      }
    }
    ```

---

## 4. Control de Seguridad y Configuración de JWT

### Middleware de Verificación de JWT (`authMiddleware.js`)

La seguridad de las rutas restringidas está delegada a un middleware personalizado. Éste intercepta el flujo HTTP y evalúa las credenciales criptográficas del cliente:

```javascript
import jwt from "jsonwebtoken";
import LogHelper from "../helpers/logHelper.js";

const SECRET_KEY = process.env.JWT_SECRET; 

export const authMiddleware = (req, res, next) => {
    // 1. Obtener cabecera de Autorización
    const authHeader = req.headers.authorization;

    // 2. Comprobar existencia y esquema Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso denegado. Token no provisto o formato inválido." });
    }
    
    // 3. Aislar el string del hash JWT
    const token = authHeader.split(" ")[1];

    try {
        // 4. Verificar firma y expiración contra la clave secreta
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 5. Inyectar datos decodificados en el flujo de la solicitud (req.user)
        req.user = decoded; 
        
        // 6. Ceder el control al siguiente middleware/controlador
        next(); 
    } catch (error) {
        // Registrar error en log si es inválido o expiró
        LogHelper.logError(error);
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};
```

### Estructura de Resguardo en el Payload del Token

Al iniciar sesión exitosamente en `authController.js`, el token firmado encapsula datos estratégicos del usuario. Se determinó almacenar información de identificación única que facilite el reconocimiento lógico pero que no ponga en riesgo la integridad de la base de datos:

```javascript
const payload = { 
  id: user.id,             // ID único del usuario para cruce de relaciones SQL
  username: user.username, // Nombre de usuario para auditoría rápida o visualización básica
  email: user.email        // Dirección de correo electrónico del usuario activo
};
```

#### Razones de Seguridad en el Payload:
1.  **Exclusión de Datos Sensibles:** Un JWT contiene información simplemente codificada en Base64 (fácilmente descifrable por el cliente). Por ello, **jamás** se incluye el hash del password ni información bancaria o sensible en él.
2.  **Facilidad de Identificación en Capas Posteriores:** Al inyectar el payload decodificado en `req.user`, el resto de controladores obtiene acceso inmediato a `req.user.id` de forma nativa e infalsificable, permitiendo la creación de publicaciones o la actualización del perfil sin necesidad de pasar el ID por parámetros expuestos en la URL.
3.  **Vencimiento Controlado:** Los tokens son emitidos con un tiempo de vida acotado (`expiresIn: '2h'`), limitando la ventana de vulnerabilidad en caso de robo o filtración del token en el cliente.