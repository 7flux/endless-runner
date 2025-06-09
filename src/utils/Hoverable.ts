export class Actionable {
  static setHoverable(objects, input, config = { color: {
    pointerover: '#dddddd',
    pointerout: '#fff',
  } }) {
    objects.forEach((object) => {
      object
        .on('pointerover', () => {
          input.setDefaultCursor('pointer');
          object.setColor(config.color.pointerover);
        })
        .on('pointerout', () => {
          input.setDefaultCursor('default');
          object.setColor(config.color.pointerout);
        })
    })
  }
}