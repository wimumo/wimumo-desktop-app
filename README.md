# WIMUMO-DESKTOP

![version](https://img.shields.io/badge/version-2.0.0-blue)
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

- [ v2.0.0 ] Cambios visuales y dinamismo en la aplicación.
- [ v1.1.0 ] Agregado de opciones de ruteo para Costruct3 o Processing p5.js
- [ v1.0.0 ] Primera versión funcional con "capacidades reducidas".

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

## Compatibilidad

Versiones de la aplicación comprobadas que no presentan problemas de compatibilidad en su funcionamiento en conjunto con el [firmware](https://github.com/wimumo/wimumo-lite-firmware) del dispositivo:

| Aplicación de escritorio | Firmware compatible |
| :---: | :---: |
| v2.0.0 | v1.0 |
| v1.1.0 | v1.0 |
| v1.0.1 | v1.0 |
| v1.0.0 | v1.0 |
