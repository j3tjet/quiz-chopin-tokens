# Quiz relámpago verificable — Chopin + Celestia

Demo educativa para introducir Chopin (login y verificabilidad) y Celestia (Data Availability). Incluye:
- Login integrado de Chopin (email o wallet embebida).
- Respuestas con tiempo verificable (Oracle.now) y notarización (Oracle.notarize).
- Leaderboard por acierto y rapidez.

Nota: Esta demo NO usa “modo demo”; el backend requiere sesión de Chopin.

==================================================
REQUISITOS
==================================================
- Node 18 o superior (recomendado Node 20)
- npm 8 o superior
- Navegador moderno (Chrome, Edge o Firefox actualizados)

==================================================
INSTALACIÓN
==================================================
1) Clonar el repositorio y entrar a la carpeta del proyecto
   git clone <TU_REPO_URL>
   cd quiz-chopin

2) Instalar dependencias
   npm i

==================================================
EJECUCIÓN LOCAL (MODO VERIFICABLE)
==================================================
Este proyecto usa el proxy de Chopin (chopd) en el puerto 4000 y un servidor Next en el puerto 3000.

OPCIÓN A — Una sola terminal (recomendada)
1) Crear el archivo chopin.config.json en la raíz si no existe, con este contenido:
   { "command": "next dev -p 3000", "proxyPort": 4000, "targetPort": 3000 }

2) Ejecutar el comando:
   npx chopd

3) Abrir en el navegador:
   http://localhost:4000/quiz
   http://localhost:4000/leaderboard

OPCIÓN B — Dos terminales
- Terminal A (Next en 3000):
  npm run dev
- Terminal B (proxy de Chopin en 4000):
  npx chopd

==================================================
USO LOCAL (SIMULAR VARIOS PARTICIPANTES)
==================================================
1) Abrir varias ventanas privadas o perfiles de navegador (Incógnito/InPrivate/Private).
2) En cada ventana:
   - Entrar a:  http://localhost:4000/quiz
   - Pulsar:    Iniciar sesión (Chopin)  →  completar y regresar a /quiz
   - Pulsar:    Ya inicié sesión → Detectar address
   - Responder las preguntas (el orden es el mismo para todos)
3) Abrir: http://localhost:4000/leaderboard  en otra ventana para ver el ranking.

Nota: El almacenamiento es en memoria. Al reiniciar el servidor se borra el historial (ideal para talleres).

==================================================
ARCHIVOS CLAVE
==================================================
- app/quiz/page.tsx            → UI del quiz
- components/AuthButton.tsx    → login de Chopin y detección de address
- lib/questions.ts             → banco de preguntas básicas
- app/api/quiz/start/route.ts  → inicialización simple (seed)
- app/api/quiz/answer/route.ts → registra respuesta; usa Oracle.now y Oracle.notarize
- app/api/quiz/leaderboard/route.ts → ranking por acierto y rapidez
- app/api/quiz/proof/[id]/route.ts   → muestra la prueba JSON de una respuesta

==================================================
PROBLEMAS COMUNES
==================================================
1) “Error occurred while trying to proxy: localhost:4000/”
   - El proxy en 4000 no encuentra el target en 3000.
   - Soluciones:
     a) Usar chopin.config.json y correr: npx chopd
     b) Correr npm run dev (3000) en una terminal y npx chopd (4000) en otra
     c) Asegurarse de abrir http://localhost:4000 en el navegador

2) No se obtuvo dirección / error 401 al responder
   - Iniciar sesión en /_chopin/login y luego pulsar “Detectar address”
   - Probar en ventana privada para evitar extensiones que inyectan scripts

3) 504 / timeouts
   - Reintentar (los oráculos pueden tardar)
   - Verificar que solo haya una instancia de npx chopd y que Next esté corriendo
