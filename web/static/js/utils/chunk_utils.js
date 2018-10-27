import _ from 'lodash';

let $canvas = document.createElement("canvas");
const ChunkUtils = {
  groupByRow(chunks) {
    return _.groupBy(chunks, (chunk) => chunk.row);
  },
  /**
  * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
  * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
  */
  chunkWidth(chunk) {
    if(chunk._width) {
      return chunk._width;
    }

    let context = $canvas.getContext("2d");
    context.font = `${chunk.fontStyle} ${chunk.fontWeight} ${chunk.fontSize}px "${chunk.fontFamily}"`;
    let metrics = context.measureText(chunk.text);

    chunk._width = metrics.width; // Cache the results
    return metrics.width;
  },

  spaceChunkWidth({fontFamily, fontStyle, fontSize, fontWeight}) {
    return ChunkUtils.chunkWidth({text: ' ', fontFamily, fontStyle, fontSize, fontWeight})
           + (fontSize * 0.1);
  },

  rowWidth(chunks) {
    let width = _.sumBy(chunks, chunk => ChunkUtils.chunkWidth(chunk));
    width += (ChunkUtils.spaceChunkWidth(chunks[0]) * (chunks.length - 1))
    return width;
  },

  maxRowWidth(rows) {
    return _.max(_.map(rows, row => ChunkUtils.rowWidth(row)));
  },

  getBoundingBox(chunks) {

    let rows = ChunkUtils.groupByRow(chunks);

    let firstRow = rows[0];
    let lastRow = rows[_.size(rows) - 1];

    return {
      top: rows[0][0].top,
      left: _.minBy(chunks, chunk => chunk.left).left,
      width: ChunkUtils.maxRowWidth(rows),
      height: (lastRow[0].top + lastRow[0].fontSize) - firstRow[0].top
    }
  }
}

export default ChunkUtils;
