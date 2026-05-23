export function createInputController(canvas, actions = {}) {
  const keys = {};
  const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    worldX: 0,
    worldY: 0,
    isLeftDown: false
  };

  const target = canvas.ownerDocument.defaultView ?? window;

  const onKeyDown = (event) => {
    keys[event.key.toLowerCase()] = true;
    if (event.key === ' ') {
      event.preventDefault();
      actions.triggerUltimate?.();
    }
  };

  const onKeyUp = (event) => {
    keys[event.key.toLowerCase()] = false;
  };

  const onMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };

  const onMouseDown = (event) => {
    if (event.button === 0) {
      mouse.isLeftDown = true;
    }
    if (event.button === 2) {
      actions.throwWeapon?.();
    }
  };

  const onMouseUp = (event) => {
    if (event.button === 0) {
      mouse.isLeftDown = false;
    }
  };

  const onContextMenu = (event) => {
    event.preventDefault();
  };

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('contextmenu', onContextMenu);

  return {
    keys,
    mouse,
    destroy() {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      mouse.isLeftDown = false;
    }
  };
}
