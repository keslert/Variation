import Plugin from './plugin';
import ChunkUtils from '../utils/chunk_utils';

/* This plugin takes chunks and assigns them to rows */
export default class RowSplitterPlugin extends Plugin {
  constructor(chunks) {
    super();
    this.name = "Line Breaks";
    this.permanent = true;
    this.resetParams(chunks);
  }

  resetParams(chunks) {
    this.params = {};
    chunks.forEach((chunk, index) => {
      this.params[index] = {
        label: chunk.text,
        options: [
          {label: 'Line Break', value: true },
          {label: 'No Line Break', value: false }
        ]
      }
    })
  }

  modify(card, decider) {
    // if(!this.params[0] || this.params[0].label != card.chunks[0].text ||
    //     _.size(this.params) != chunks.length) {
    //   this.resetParams(chunks);
    // }

    let row = 0;
    card.chunks.forEach((chunk, index) => {
      let option = decider(index, this.params[index].options);
      chunk.row = row;
      if(option.value) {
        row++;
      }
    })
  }

  getMarkers(card) {
    const chunks = _.slice(card.chunks, 0, -1);

    return chunks.map((chunk, i) => {
      const noBreak = chunk.row == card.chunks[i + 1].row;
      return {
        type: 'handle',
        style: {
          // backgroundColor: noBreak ? '#ffffff' : '#df4c53',
          // top: `${chunk.top + chunk.fontSize - 1}px`,
          // left: `${chunk.left + ChunkUtils.chunkWidth(chunk) - 2}px`,

          color: noBreak ? '#e74c3c' : '#2ecc71',
          top: `${chunk.top}px`,
          left: `${chunk.left}px`,
          height: `${chunk.fontSize}px`,
          width: `${ChunkUtils.chunkWidth(chunk)}`,
        },
        option: this.params[i].options[noBreak ? 0 : 1],
        param: i,
      }
    })
  }
}
