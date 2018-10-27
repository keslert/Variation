import Plugin from './plugin';

let BLUR_RADIUS = "Blur Radius";
let VERTICAL_OFFSET = "Vertical Offset";
let OPACITY = "Opacity";

export default class TextShadowPlugin extends Plugin {
  constructor() {
    super();
    this.name =  'Text Shadow';
    this.params = {
      [BLUR_RADIUS]: {
        label: BLUR_RADIUS,
        options: [
          {label: 'None', value: 0 },
          {label: 'Small', value: 1 },
          {label: 'Large', value: 2 },
          {
            custom: true,
            label: 'Radius',
            element: 'input',
            type: 'number',
            min: 0,
            max: 30,
            value: 1,
            step: 1,
          }
        ],
      },
      [VERTICAL_OFFSET]: {
        label: VERTICAL_OFFSET,
        options: [
          {label:'None', value: 1 },
          {label:'Small', value: 2 },
          {label:'Large', value: 3 },
          {
            custom: true,
            label: 'Offset',
            element: 'input',
            type: 'number',
            min: 0,
            max: 30,
            value: 1,
            step: 1,
          }
        ]
      },
      [OPACITY]: {
        label: OPACITY,
        options: [
          {label:'Transparent', value: 10 },
          {label:'Translucent', value: 40 },
          {label:'Opaque', value: 60 },
          {
            custom: true,
            label: 'Opacity',
            element: 'input',
            type: 'number',
            min: 0,
            max: 100,
            value: 90,
            units: '%',
            step: 5,
          }
        ]
      }
    }
  }

  modify(card, decider) {
    let blur = decider(BLUR_RADIUS, this.params[BLUR_RADIUS].options).value;
    let offset = decider(VERTICAL_OFFSET, this.params[VERTICAL_OFFSET].options).value;
    let opacity = decider(OPACITY, this.params[OPACITY].options).value;

    card.props.textShadowBlur = blur;
    card.props.textShadowOffset = offset;
    card.props.textShadowOpacity = opacity;
    card.chunks.forEach(chunk => {
      chunk.textShadow = `0 ${offset}px ${blur}px rgba(0,0,0,${opacity/100})`;
    })

  }

  getCustomValues(card) {
    return {
      [BLUR_RADIUS]: card.props.textShadowBlur,
      [VERTICAL_OFFSET]: card.props.textShadowOffset,
      [OPACITY]: card.props.textShadowOpacity
    }
  }

}
