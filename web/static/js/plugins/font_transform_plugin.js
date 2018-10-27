import Plugin from './plugin';

let LETTER_CASE_KEY = 'Letter Case';

export default class FontTransformPlugin extends Plugin {
    constructor() {
      super();
      this.name = "Text Transform";
      this.permanent = true;
      this.params = {
        [LETTER_CASE_KEY]: {
          label: LETTER_CASE_KEY,
          options: [
            {label: 'Uppercase', value: 'upper' },
            {label: 'Lowercase', value: 'lower' },
            {label: 'Normal', value: 'normal' }
          ]
        }
      }
    }

    modify(card, decider) {
      this.modifyLetterCase(card.chunks, decider)
    }

    modifyLetterCase(chunks, decider) {
      let option = decider(LETTER_CASE_KEY, this.params[LETTER_CASE_KEY].options);

      let func;
      if(option.value == 'upper') {
        func = (text) => text.toUpperCase();
      } else if(option.value == 'lower') {
        func = (text) => text.toLowerCase();
      } else {
        func = (text) => text;
      }

      chunks.forEach((chunk) => { chunk.text = func(chunk.text) })
    }

}
