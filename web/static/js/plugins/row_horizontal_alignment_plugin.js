import Plugin from './plugin';
import ChunkUtils from '../utils/chunk_utils';

let ROW_ALIGNMENT_KEY = "Horizontal Alignment"

export default class RowHorizontalAlignmentPlugin extends Plugin {
  constructor() {
    super();
    this.name =  'Text Alignment';
    this.permanent = true;
    this.params = {
      [ROW_ALIGNMENT_KEY]: {
        label: ROW_ALIGNMENT_KEY,
        options: [
          {label: 'Left', value: 'left' },
          {label: 'Center', value: 'center' },
          {label: 'Right', value: 'right' }
        ],
      }
    }
  }
  modify(card, decider) {
    let rows = ChunkUtils.groupByRow(card.chunks);
    this.modifyAlignment(rows, decider)
  }

  modifyAlignment(rows, decider) {
    let option = decider(ROW_ALIGNMENT_KEY, this.params[ROW_ALIGNMENT_KEY].options);
    this.alignRows(option.value, rows);
  }

  alignRows(alignment, rows) {
    let max = ChunkUtils.maxRowWidth(rows);
    _.forEach(rows, (row) => {
      let offset = this.calculateRowOffset(row, max, alignment);
      row.forEach((chunk) => {
        chunk.left += offset;
      })
    })
  }

  calculateRowOffset(row, max, alignment) {
    let width = ChunkUtils.rowWidth(row);
    let diff = max - width;

    let offset = 0;
    if(alignment == 'center') {
      offset = diff / 2;
    } else if(alignment == 'right') {
      offset = diff;
    }

    return offset;
  }

}
