# WIMUMO-DESKTOP

![version](https://img.shields.io/badge/version-1.0.0-blue)
[![license](https://img.shields.io/github/license/gibic-leici/wimumo-desktop-app)](https://github.com/gibic-leici/wimumo-desktop-app/blob/main/LICENSE)

Aplicación de escritorio para interacción con WIMUMO

## Características

### Auto-configuración de WIMUMO OSC

Muestra si se detectó un WIMUMO en la red.

NO IMPLEMENTADO:

Dialoga con WIMUMO para configurar los datos de osc (ip y puerto) de la computadora donde corre la aplicación (se puede hacer desde la página de configuración de WIMUMO, pero esto es más fácil para usuarios sin experiencia).

Notifica si el OSC está activado.

Se transmite por este medio la lista de canales OSC disponibles.

### Ver las señales 

Tiene un graficador rápido con ajuste automático de muestras por segundo para graficar siempre la misma ventana de tiempo, sin importar si vienen señales "crudas" o de envolvente

### Reproducir sonidos

Copiado de la app web anterior pero no implementado

### Ayuda para el uso de WIMUMO

No implementado. 

### Calibración de canales

No implementado

### Retransmisión de osc

No implementado

## Instalación

### Versiones

- [ v1.0 ] Primera versión funcional con "capacidades reducidas".

### Instalación manual

**Pre-requisitos**

- [Node.js](https://nodejs.org/en/) con `npm`.

**Dependencias**

- [Electron](https://www.electronjs.org/)
- [Electron Forge](https://www.electronforge.io/)
- [node-osc](https://www.npmjs.com/package/node-osc)
- [websocket](https://www.npmjs.com/package/websocket)

Instación de dependencias:

```ps
npm install
```

## TO-DO 

- [ ] Modularizar graficador en canvas
- [x] Mejorar el aspecto (mejoró...)
- [x] Selección de canales osc para ver en el graficador
- [ ] Calibración