# Integración de NPCs con el Panel de Chat

## Comunicación Juego -> Panel

Para activar el chat de un NPC específico desde Phaser, envía un mensaje al parent:

```javascript
// Cuando el jugador interactúa con un NPC
window.parent.postMessage({
  type: 'NPC_INTERACTION',
  npcId: 'arca' // 'arca' | 'dgr' | 'municipalidad'
}, '*');
```

## NPCs Disponibles

| ID | Nombre | Jurisdicción | Color | Especialidad |
|---|---|---|---|---|
| `arca` | ARCA | Nacional | Azul (#3B82F6) | IVA, Ganancias, Monotributo, Facturación |
| `dgr` | DGR Salta | Provincial | Verde (#22C55E) | Ingresos Brutos, Sellos, Inmobiliario |
| `municipalidad` | Municipalidad | Municipal | Ámbar (#F59E0B) | Tasas, Habilitaciones, ABL |

## Ejemplo de Implementación en Phaser

```javascript
// En tu escena de Phaser
class OfficeScene extends Phaser.Scene {
  createNPCs() {
    // NPC de ARCA
    this.npcArca = this.add.sprite(200, 300, 'npc-arca');
    this.npcArca.setInteractive();
    this.npcArca.on('pointerdown', () => {
      this.showDialog('arca', '¡Hola! Soy de ARCA. ¿Necesitas ayuda con tus impuestos nacionales?');
    });

    // NPC de DGR
    this.npcDgr = this.add.sprite(400, 300, 'npc-dgr');
    this.npcDgr.setInteractive();
    this.npcDgr.on('pointerdown', () => {
      this.showDialog('dgr', '¡Bienvenido! Te ayudo con Ingresos Brutos y tributos provinciales.');
    });

    // NPC de Municipalidad
    this.npcMuni = this.add.sprite(600, 300, 'npc-muni');
    this.npcMuni.setInteractive();
    this.npcMuni.on('pointerdown', () => {
      this.showDialog('municipalidad', '¡Hola vecino! ¿Consultas sobre tasas municipales?');
    });
  }

  showDialog(npcId, message) {
    // Mostrar diálogo in-game
    this.dialogBox.setText(message);
    this.dialogBox.setVisible(true);
    
    // Botón para abrir chat completo
    this.openChatButton.setVisible(true);
    this.currentNPC = npcId;
  }

  openFullChat() {
    // Enviar mensaje al panel de chat
    window.parent.postMessage({
      type: 'NPC_INTERACTION',
      npcId: this.currentNPC
    }, '*');
  }
}
```

## Escuchar Respuestas del Panel (Opcional)

Si necesitas que el juego reaccione a eventos del chat:

```javascript
// En tu escena de Phaser
create() {
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'CHAT_MESSAGE') {
      // Hacer algo en el juego cuando llega un mensaje
      console.log('Mensaje del chat:', event.data.message);
    }
  });
}
```

## Colores para Sprites/UI

Usa estos colores para mantener consistencia visual:

```javascript
const NPC_COLORS = {
  arca: 0x3B82F6,        // Azul
  dgr: 0x22C55E,         // Verde  
  municipalidad: 0xF59E0B // Ámbar
};

// Para outlines o efectos de hover
this.npcArca.on('pointerover', () => {
  this.npcArca.setTint(NPC_COLORS.arca);
});
```
