# Presenter Guide — Quiz Chopin + Celestia

Esta guía es para ti como presentador. El README del repositorio está pensado para uso local y simple; aquí tienes extras para tu sesión en vivo.

==================================================
PLAN DE LA DEMO (SUGERIDO)
==================================================
1) Arranque (1 min)
   - Ejecutar: npx chopd
   - Abrir:    http://localhost:4000/quiz

2) Login y verificabilidad (3–5 min)
   - Mostrar:  Iniciar sesión (Chopin)  →  /_chopin/login
   - Volver a: /quiz  →  Ya inicié sesión → Detectar address
   - Explicar: Oracle.now (tiempo verificable) y Oracle.notarize (prueba)

3) Juego local (3–5 min)
   - Abrir 2–3 ventanas privadas y responder como “participantes” distintos
   - Mostrar:  http://localhost:4000/leaderboard  en otra ventana

4) (Opcional) Abrir a la audiencia (3–5 min)
   - Exponer con Cloudflare Tunnel (Quick Tunnel) y compartir URL pública
   - Todos responden a la vez; se ve el leaderboard global

5) Cierre (Q&A y próximos pasos)

==================================================
CLOUDFLARE TUNNEL (OPCIONAL, PARA AUDIENCIA REMOTA)
==================================================
No lo incluyas en el README si no quieres. Úsalo solo si te sirve durante el taller.

Windows (PowerShell)
- Asegúrate de que la app está corriendo con:  npx chopd
- Abrir túnel (si cloudflared está en PATH):
  cloudflared tunnel --url http://localhost:4000
- Si no está en PATH pero está instalado por Chocolatey (ruta habitual):
  & "C:\ProgramData\chocolatey\lib\cloudflared\tools\cloudflared.exe" tunnel --url http://localhost:4000

macOS / Linux
- Ejecutar:
  npx chopd
  cloudflared tunnel --url http://localhost:4000

Notas
- Mantener dos terminales: una para la app, otra para el túnel
- Sugerir a la audiencia usar modo incógnito si aparecen errores por extensiones
- Si la URL tarda en estar disponible, esperar unos segundos y recargar

==================================================
CHECKLISTS
==================================================
Antes de empezar
- npm i terminado
- npx chopd funcionando en http://localhost:4000/quiz
- Login de Chopin y Detectar address funcionando
- Al menos dos ventanas privadas respondiendo y /leaderboard visible

Durante la demo
- Si algo no responde, revisar que no haya otra instancia de chopd
- Usar ventanas privadas para simular múltiples usuarios
- Enfocarse en verificabilidad y experiencia (no en infraestructura)

Plan B rápido
- Si el túnel falla, continuar solo con la demo local (ventanas privadas)
- Si el login falla en un navegador, intentar con ventana privada u otro navegador

==================================================
NOTAS DEL PROYECTO
==================================================
- Estado en memoria (se reinicia al parar el server)
- Preguntas con orden fijo para todos (seed)
- Cada respuesta muestra: acierto/incorrecto, timestamp verificable y enlace a la prueba JSON
