import Plugin from './plugin';
import ChunkUtils from '../utils/chunk_utils';

let SPACING_KEY = "Vertical Spacing"

export default class RowVerticalSpacingPlugin extends Plugin {
  constructor() {
    super();
    this.name = "Text Vertical Spacing";
    this.permanent = true;
    this.params = {
      [SPACING_KEY]: {
        label: SPACING_KEY,
        options: [
          {label: 'Small', value: 1 },
          {label: 'Medium', value: 4 },
          {label: 'Large', value: 10 },
          {
            custom: true,
            label: 'Spacing',
            element: 'input',
            type: 'number',
            min: 0,
            max: 100,
            value: 5,
            step: 4,
          }
        ],
      }
    };
  }

  modify(card, decider) {
    let option = decider(SPACING_KEY, this.params[SPACING_KEY].options);
    card.props.verticalSpacing = option.value;
    this.spaceRows(ChunkUtils.groupByRow(card.chunks), option.value);
  }

  spaceRows(rows, spacing) {
    let y = 0;
    // let prevFontSize = rows[0][0].fontSize;
    _.forEach(rows, (row) => {
      let fontSize = row[0].fontSize;

      row.forEach((chunk) => {
        chunk.top = y;
      })
      y += (fontSize + spacing);
      // prevFontSize = fontSize;
    })
  }

  getCustomValues(card) {
    return {
      [SPACING_KEY]: card.props.verticalSpacing,
    }
  }

}
