# WIMUMO-DESKTOP

Programa de escritorio para usar WIMUMO

Hasta la v02 Hecho en Electron Fiddle https://www.electronjs.org/fiddle

Luego preparado para compilar con electron-forge

Instalar Nodejs y electron-forge.

## Características

### Auto-configuración de wimumo OSC

Muestra si se detectó un wimumo en la red.

NO IMPLEMENTADO:

Dialoga con wimumo para configurar los datos de osc (ip y puerto) de la computadora donde corre la aplicación (se puede hacer desde la página de configuración de WIMUMO, pero esto es más fácil para usuarios sin experiencia).

Notifica si el OSC está activado.

Se transmite por este medio la lista de canales OSC disponibles.

### Ver las señales 

Tiene un graficador rápido con ajuste automático de muestras por segundo para graficar siempre la misma ventana de tiempo, sin importar si vienen señales "crudas" o de envolvente

### Reproducir sonidos

Copiado de la app web anterior pero no implementado

### Ayuda para el uso de wimumo

No implementado. 

### Calibración de canales

No implementado

### Retransmisión de osc

No implementado

## Repositorio

La rama principal es "master".
Se crean ramas con versiones. Actualmente existe: 
 - v0.1 Primera versión funcional de "capacidades reducidas".

### TO-DO 

- [ ] Modularizar graficador en canvas
- [x] Mejorar el aspecto (mejoró...)
- [x] Selección de canales osc para ver en el graficador
- [ ] Calibración