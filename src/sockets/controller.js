class NesController {
  constructor(nes) {
    this.keys = {
      ArrowUp: nes.Controller.BUTTON_UP,
      ArrowDown: nes.Controller.BUTTON_DOWN,
      ArrowLeft: nes.Controller.BUTTON_LEFT,
      ArrowRight: nes.Controller.BUTTON_RIGHT,
      Enter: nes.Controller.BUTTON_SELECT,
      Backspace: nes.Controller.BUTTON_START,
      KeyZ: nes.Controller.BUTTON_A,
      KeyX: nes.Controller.BUTTON_B,
      12: nes.Controller.BUTTON_UP,
      13: nes.Controller.BUTTON_DOWN,
      14: nes.Controller.BUTTON_LEFT,
      15: nes.Controller.BUTTON_RIGHT,
      8: nes.Controller.BUTTON_SELECT,
      9: nes.Controller.BUTTON_START,
      1: nes.Controller.BUTTON_A,
      0: nes.Controller.BUTTON_B,
    };
  };
};

module.exports = {NesController};
