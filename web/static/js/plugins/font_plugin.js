import Plugin      from './plugin';
import GoogleFonts from '../utils/google_fonts';

const FONT_TYPE_KEY = 'Font Type';
const FONT_WEIGHT_KEY = 'Font Weight';
const FONT_STYLE_KEY = 'Font Style';

export default class FontPlugin extends Plugin {

  constructor() {
    super();
    this.name = "Font";
    this.permanent = true;
    this.params = {
      [FONT_TYPE_KEY]: {
        label: FONT_TYPE_KEY,
        options: [
          {label: 'Sans-serif', value: 'sans-serif'},
          {label: 'Serif', value: 'serif'},
          {label: 'Cursive', value: 'cursive'},
          {
            custom: true,
            label: 'Font',
            element: 'dropdown',
            value: _.map(GoogleFonts, 'name')[0],
            options: _.map(GoogleFonts, 'name')
          }
        ]
      },
      [FONT_WEIGHT_KEY]: {
        label: FONT_TYPE_KEY,
        options: [
          {label: 'Light', value: [100, 200, 300]},
          {label: 'Normal', value: [400, 500, 600]},
          {label: 'Bold', value: [700, 800, 900]},
          {
            custom: true,
            label: 'Weight',
            element: 'dropdown',
            value: 400,
            options: [100, 200, 300, 400, 500, 600, 700, 800, 900]
          }
        ]
      },
      [FONT_STYLE_KEY]: {
        label: FONT_STYLE_KEY,
        options: [
          {label: 'Normal', value: 'normal'},
          {label: 'Italic', value: 'italic'}
        ]
      }
    };
  }

  modify(card, decider) {
    let typeOption = decider(FONT_TYPE_KEY, this.params[FONT_TYPE_KEY].options);
    let weightOption = decider(FONT_WEIGHT_KEY, this.params[FONT_WEIGHT_KEY].options);
    let styleOption = decider(FONT_STYLE_KEY, this.params[FONT_STYLE_KEY].options);

    let fonts = _.filter(GoogleFonts, (font) => (
      typeOption.custom
      ? font.name == typeOption.value
      : font.type == typeOption.value
    ))

    let style = styleOption.value;
    let weights = weightOption.custom ? [weightOption.value] : weightOption.value;

    let weightedFonts = _.filter(fonts, (font) => (
      !_.isEmpty(_.intersection(font.styles[style], weights))
    ))

    let font = weightedFonts[_.random(0, weightedFonts.length - 1)] ||
               fonts[_.random(0, fonts.length - 1)] // Backup in case we can't accomodate weight and style

    let fontFamily = font.name;
    let fontStyle = style;
    let fontWeight = weights[_.random(0, weights.length - 1)];
    card.chunks.forEach((chunk) => {
      _.extend(chunk, {fontFamily, fontStyle, fontWeight});
    })
  }

  getCustomValues(card) {
    const chunk = card.chunks[0];
    return {
      [FONT_TYPE_KEY]: chunk.fontFamily,
      [FONT_WEIGHT_KEY]: chunk.fontWeight,
      [FONT_STYLE_KEY]: chunk.fontStyle,
    }
  }
}
