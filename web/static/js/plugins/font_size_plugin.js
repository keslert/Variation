import Plugin from './plugin';
import _ from 'lodash';
import ChunkUtils from '../utils/chunk_utils';

let FONT_BASE_SIZE_KEY = 'Font Base Size';
let FONT_RATIO_KEY = 'Row Ratio';

export default class FontSizePlugin extends Plugin {

  constructor() {
    super();
    this.name = 'Font Size';
    this.permanent = true;
    this.params = {
      [FONT_RATIO_KEY]: {
        label: FONT_RATIO_KEY,
        options: [
          {label: 'Equal Size', value: 'equal-size' }, // Do nothing
          {label: 'Equal Widths', value: 'equal-widths' },
        ]
      },
      [FONT_BASE_SIZE_KEY]: {
        label: FONT_BASE_SIZE_KEY,
        options: [
          {label: 'Tiny', value: 20},
          {label: 'Small', value: 30},
          {label: 'Medium', value: 40},
          {label: 'Large', value: 50},
          {label: 'Huge', value: 60},
          {
            custom: true,
            label: 'Size',
            element: 'input',
            type: 'number',
            min: 8,
            max: 300,
            value: 40,
            step: 4,
          }
        ],
      }
    }
  }

  modify(card, decider) {
    let rows = _.groupBy(card.chunks, (chunk) => chunk.row);

    this.modifyFontBaseSize(card, decider)
    this.modifyFontRatio(rows, decider)
    this.setLeftPosition(rows);
  }

  modifyFontBaseSize(card, decider) {
    let option = decider(FONT_BASE_SIZE_KEY, this.params[FONT_BASE_SIZE_KEY].options);
    card.props.baseFontSize = option.value;
    this.setFontSize(card.chunks, option.value);
  }

  modifyFontRatio(rows, decider) {
    let option = decider(FONT_RATIO_KEY, this.params[FONT_RATIO_KEY].options);

    switch(option.value) {
      case 'equal-widths':
          this.justifyFonts(rows);
          break;
    }
  }

  justifyFonts(rows) {
    let maxWidth = ChunkUtils.maxRowWidth(rows);
    _.forEach(rows, (row) => {
      this.fitRow(row, maxWidth);
    })
  }

  setFontSize(chunks, size) {
    chunks.forEach((chunk) => {
      if(chunk.fontSize != size) {
        chunk.fontSize = size;
        chunk.height = size;
        chunk.lineHeight = size;
        chunk._width = null; // Cached property used to save calculations on width
      }
    })
  }

  fitRow(chunks, rowWidth) {
    let width = ChunkUtils.rowWidth(chunks);
    let fontSize = chunks[0].fontSize * (rowWidth / width);
    this.setFontSize(chunks, fontSize);
  }

  setLeftPosition(rows) {
    _.forEach(rows, (row) => {
      let spaceWidth = ChunkUtils.spaceChunkWidth(row[0]);
      let x = -spaceWidth;
      row.forEach((chunk) => {
        chunk.left = x + spaceWidth;
        x += spaceWidth + ChunkUtils.chunkWidth(chunk);
      })
    })
  }

  score(card) {
    let score = 0;

    let fontSizes = _.map(card.chunks, 'fontSize');

    let min = _.min(fontSizes);
    let max = _.max(fontSizes);

    let ratio = max / min;
    if(ratio > 5) {
      score += ratio;
    }

    return score;
  }

  getCustomValues(card) {
    return {
      [FONT_BASE_SIZE_KEY]: card.props.baseFontSize,
    }
  }

}
