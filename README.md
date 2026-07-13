# Sistema de Citas Medicas

Sistema web full-stack para la gestion de citas medicas entre pacientes y
medicos, desarrollado como proyecto academico integrador. Implementa
autenticacion con JWT, un CRUD completo de citas, base de datos en MongoDB,
backend en Node.js/Express y frontend en React.

## Tabla de contenido
- [Descripcion general](#descripcion-general)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitectura y estructura de carpetas](#arquitectura-y-estructura-de-carpetas)
- [Modelo de datos](#modelo-de-datos)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Variables de entorno](#variables-de-entorno)
- [Endpoints de la API](#endpoints-de-la-api)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Coleccion de Postman](#coleccion-de-postman)
- [Diseno en Figma](#diseno-en-figma)
- [Buenas practicas aplicadas](#buenas-practicas-aplicadas)
- [Autores](#autores)

## Descripcion general
La aplicacion permite:
- Que un **paciente** se registre, inicie sesion y agende, edite, consulte
  o cancele sus propias citas medicas.
- Que un **medico** consulte y actualice el estado de las citas que tiene
  asignadas (pendiente, confirmada, atendida, cancelada).
- Que un **administrador** tenga visibilidad total sobre todas las citas
  del sistema.

## Tecnologias utilizadas
| Capa            | Tecnologia                                   |
|-----------------|-----------------------------------------------|
| Frontend        | React 18 + Vite, React Router, Axios           |
| Backend         | Node.js, Express                               |
| Base de datos   | MongoDB + Mongoose                             |
| Autenticacion   | JWT (jsonwebtoken) + bcryptjs                   |
| Validaciones    | express-validator (backend), validacion controlada de formularios (frontend) |
| Pruebas de API  | Postman                                        |
| Diseno          | Figma (wireframes, ver carpeta `design/`)      |
| Control de versiones | Git y GitHub                              |

## Arquitectura y estructura de carpetas
```
citas-medicas/
├── backend/
│   ├── config/          # Conexion a MongoDB
│   ├── models/           # Esquemas Mongoose (User, Cita)
│   ├── middleware/        # auth, validators, errorHandler
│   ├── controllers/       # Logica de negocio
│   ├── routes/             # Definicion de rutas REST
│   ├── seed.js             # Script de datos de prueba
│   └── server.js           # Punto de entrada del backend
├── frontend/
│   └── src/
│       ├── components/    # Navbar, PrivateRoute, CitaForm, CitaList
│       ├── context/         # AuthContext (estado global de sesion)
│       ├── pages/            # Login, Register, Dashboard, Citas
│       ├── services/          # Cliente Axios (api.js)
│       └── App.jsx / main.jsx
├── postman/               # Coleccion de Postman exportada
├── database/               # Estructura de la BD y datos de ejemplo
├── design/                  # Guia de wireframes + mockup de referencia
└── README.md
```

El backend sigue una arquitectura en capas (rutas -> controladores ->
modelos), separando responsabilidades y facilitando el mantenimiento. El
frontend separa componentes reutilizables, paginas, contexto de
autenticacion y capa de servicios (API), evitando logica duplicada.

## Modelo de datos
La base de datos usada en el proyecto es **MongoDB**, la base de datos específica es "citas.medicas" y trabaja con dos
colecciones principales:

**Coleccion `users`**: nombre, email (unico), password (hash), rol
(paciente/medico/admin), especialidad, telefono.

**Coleccion `citas`**: paciente (ref. a `users`), medico (ref. a `users`),
especialidad, fecha, hora, motivo, estado, notas. Incluye un indice unico
compuesto (medico + fecha + hora) para evitar doble agendamiento.

Archivo de ejemplo para la carga de datos:
[`database/datos_ejemplo.json`](database/datos_ejemplo.json)

## Instalacion y ejecucion

### Requisitos previos
- Node.js 18 o superior
- MongoDB (local o Atlas)

### Backend
```bash
cd backend
npm install
# Crea un archivo `.env` con las variables de abajo
npm run seed               # (opcional) inserta usuarios y una cita de ejemplo
npm run dev                 # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # ajustar VITE_API_URL si es necesario
npm run dev                 # http://localhost:5173
```

## Variables de entorno

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/citas_medicas
JWT_SECRET=cambia_esta_clave_por_una_segura
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Endpoints de la API

### Autenticacion (`/api/auth`)
| Metodo | Ruta            | Protegida | Descripcion                       |
|--------|------------------|-----------|-------------------------------------|
| POST   | `/registro`       | No        | Crea un usuario (paciente/medico)     |
| POST   | `/login`           | No        | Inicia sesion, devuelve token JWT      |
| GET    | `/perfil`           | Si        | Devuelve el usuario autenticado (valida el token) |
| GET    | `/medicos`           | Si        | Lista los usuarios con rol medico       |
| POST   | `/logout`             | Si        | Cierra la sesion                          |

### Citas (`/api/citas`) — todas requieren token JWT
| Metodo | Ruta       | Descripcion                                              |
|--------|-------------|-------------------------------------------------------------|
| POST   | `/`          | Crea una nueva cita                                          |
| GET    | `/`           | Lista citas (filtradas segun el rol del usuario autenticado)  |
| GET    | `/:id`         | Obtiene el detalle de una cita                                  |
| PUT    | `/:id`          | Actualiza una cita (fecha, hora, estado, notas, etc.)             |
| DELETE | `/:id`           | Elimina una cita                                                    |

Un **paciente** solo ve/gestiona sus propias citas; un **medico** ve las
citas donde figura como medico asignado; un **admin** ve todas.

## Usuarios de prueba
Generados con `npm run seed`:

| Rol       | Correo                     | Contrasena   |
|-----------|-----------------------------|---------------|
| Admin     | admin@clinica.com             | admin123        |
| Medico    | ana.torres@clinica.com         | medico123        |
| Paciente  | carlos@correo.com                | paciente123        |

## Coleccion de Postman
Archivo: [`postman/Citas_Medicas.postman_collection.json`](postman/Citas_Medicas.postman_collection.json)

Incluye las carpetas **Auth** (registro, login, perfil, listar medicos,
logout) y **Citas (CRUD)** (crear, listar, obtener, actualizar, eliminar).
El request de "Login" guarda automaticamente el token en una variable de
coleccion (`token`) que se reutiliza en las siguientes peticiones mediante
el header `Authorization: Bearer {{token}}`.

## Diseno en Figma
La carpeta [`design/`](design/) contiene:
- `guia_wireframes_figma.md`: especificacion de las 5 pantallas minimas
  (Login, Registro, Dashboard, Listado de citas, Formulario) con la
  paleta, tipografia y flujo de navegacion sugeridos.
- `design_mockup.html`: mockup navegable de referencia (equivalente
  visual) para facilitar la recreacion exacta del prototipo en Figma.

> Nota: el archivo `.fig` final debe crearse en la aplicacion Figma
> siguiendo esta guia, y compartirse como enlace o exportado (`.fig` /
> PDF) junto con el resto de evidencias del proyecto.

## Buenas practicas aplicadas
- Separacion de responsabilidades (rutas / controladores / modelos / middleware).
- Componentes React reutilizables (`Navbar`, `PrivateRoute`, `CitaForm`, `CitaList`).
- Validaciones en backend (`express-validator`, validaciones de esquema Mongoose)
  y en frontend (formularios controlados con atributos `required`, `minLength`, etc.).
- Manejo centralizado de errores (`errorHandler.js`) con mensajes consistentes.
- Contrasenas nunca almacenadas en texto plano (hash con bcrypt).
- Proteccion de rutas privadas tanto en backend (middleware `proteger`)
  como en frontend (`PrivateRoute`).
- Nombres descriptivos en espanol para variables, funciones y archivos,
  manteniendo consistencia en todo el proyecto.

## Autores
- Adalberto Herdoiza Mera
- Luis Fernando Guerrero Jimenez
- Marcos Johan Ochoa Suarez
