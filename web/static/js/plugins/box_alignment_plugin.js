import Plugin from './plugin';
import ChunkUtils from '../utils/chunk_utils';

const HORIZONTAL_KEY = "Horizontal Alignment";
const VERTICAL_KEY = "Vertical Alignment";

export default class BoxAlignmentPlugin extends Plugin {
  constructor(width, height) {
    super();
    this.name =  'Box Alignment';
    this.permanent = true;
    this.maxWidth = width;
    this.maxHeight = height
    this.params = {
      [HORIZONTAL_KEY]: {
        label: HORIZONTAL_KEY,
        options: [
          {label: 'Left', value: 0.25 },
          {label: 'Center', value: 0.50 },
          {label: 'Right', value: 0.75 },
          {
            custom: true,
            label: 'X-Offset',
            element: 'input',
            type: 'number',
            min: 0,
            max: this.maxWidth,
            value: 0,
            step: 10,
          }
        ],
      },
      [VERTICAL_KEY]: {
        label: VERTICAL_KEY,
        options: [
          {label:'Top', value: 0.25 },
          {label:'Center', value: 0.50 },
          {label:'Bottom', value: 0.75 },
          {
            custom: true,
            label: 'Y-Offset',
            element: 'input',
            type: 'number',
            min: 0,
            max: this.maxHeight,
            value: 0,
            step: 10,
          }
        ],
      }
    }
  }

  modify(card, decider) {
    let bb = ChunkUtils.getBoundingBox(card.chunks);
    this.modifyHorizontal(card.chunks, decider, bb);
    this.modifyVertical(card.chunks, decider, bb);
  }

  modifyHorizontal(chunks, decider, bb) {
    const option = decider(HORIZONTAL_KEY, this.params[HORIZONTAL_KEY].options);
    let xDiff = option.custom ? option.value
                              : (this.maxWidth - bb.width) * option.value;
    this.offsetChunks(chunks, xDiff, 0);
  }

  modifyVertical(chunks, decider, bb) {
    const option = decider(VERTICAL_KEY, this.params[VERTICAL_KEY].options);
    let yDiff = option.custom ? option.value
                              : (this.maxHeight - bb.height) * option.value;
    this.offsetChunks(chunks, 0, yDiff);
  }

  offsetChunks(chunks, xOffset, yOffset) {
    chunks.forEach((chunk) => {
      chunk.left += xOffset;
      chunk.top += yOffset;
    })
  }

  score(card) {
    let score = 0;
    let bb = ChunkUtils.getBoundingBox(card.chunks);
    if(bb.left < 0 || (bb.left + bb.width) > this.maxWidth) {
      score += 1000;
    }
    if(bb.top < 0 || (bb.top + bb.height) > this.maxHeight) {
      score += 1000;
    }
    return score;
  }

  markers(card) {
    let bb = ChunkUtils.getBoundingBox(card.chunks);

    return [{
      type: 'draggable',
      ...bb
    }]
  }

  getCustomValues(card) {
    const bb = ChunkUtils.getBoundingBox(card.chunks);
    return {
      [HORIZONTAL_KEY]: bb.left,
      [VERTICAL_KEY]: bb.top,
    }
  }

}
