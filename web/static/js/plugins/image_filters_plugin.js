import Plugin from './plugin';
import ChunkUtils from '../utils/chunk_utils';

let FILTER_KEY = "Filter"

export default class ImageFiltersPlugin extends Plugin {
  constructor() {
    super();
    this.name =  'Image Filters';
    this.params = {
      [FILTER_KEY]: {
        label: FILTER_KEY,
        options: [
          {label: 'No Filter', value: ""},
          {label: 'Aden', value: "aden"},
          {label: 'Reyes', value: "reyes"},
          {label: 'Perpetua', value: "perpetua"},
          {label: 'Inkwell', value: "inkwell"},
          {label: 'Toaster', value: "toaster"},
          {label: 'Walden', value: "walden"},
          {label: 'Hudson', value: "hudson"},
          {label: 'Gingham', value: "gingham"},
          {label: 'Mayfair', value: "mayfair"},
          {label: 'Lo', value: "lofi"},
          {label: 'X', value: "xpro2"},
          {label: '1977', value: "_1977"},
          {label: 'Brooklyn', value: "brooklyn"},
          {label: 'Nashville', value: "nashville"},
          {label: 'Lark', value: "lark"},
          {label: 'Moon', value: "moon"},
          {label: 'Clarendon', value: "clarendon"},
          {label: 'Willow', value: "willow"},
        ],
      }
    }
  }


  modify(card, decider) {
    this.modifyFilter(card, decider)
  }

  modifyFilter(card, decider) {
    let option = decider(FILTER_KEY, this.params[FILTER_KEY].options);
    card.classNames.push(option.value);
  }

}
