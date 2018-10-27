import F from '../constants/format';
import { chunkText, weightedRandom } from './';

let id = 1;

/* Generates a new card */
export function generateCard(plugins, text, style, registry) {

  const card = generateBlankCard(text, style);

  _.forEach(filterPlugins(plugins, registry), plugin => {
    plugin.modify(card, (param, options) => {
      const partial_key = getPartialKey(plugin, param);
      let option = getWeightedOption(options, partial_key, registry);
      if(option.custom) {
        option = {...option, value: registry[getCustomKey(partial_key)]};
      }

      card.meta[getOptionKey(partial_key, option)] = true;
      return option;
    })
  });

  const custom = getCustom(card, plugins);
  const score = getScore(card, plugins);
  return {...card, custom, score};
}

/* Clones a card except mutating the parameters in the overrides variable */
export function mutateCard(plugins, text, mutationCard, registry, overrides = {}, blacklist = {}) {

  const card = generateBlankCard(text, mutationCard.style);

  _.forEach(filterPlugins(plugins, registry), plugin => {
    plugin.modify(card, (param, options) => {

      const partial_key = getPartialKey(plugin, param);

      let option = getMetaOption(options, partial_key, mutationCard.meta) ||
                   getWeightedOption(options, partial_key, registry);

      while(blacklist[getOptionKey(partial_key, option)]) {
        option = getWeightedOption(options, partial_key, registry);
      }

      if(partial_key == 'Font-Font Type') {
        option = _.find(options, option => option.custom);
      }

      // Is this the parameter to override?
      if(overrides[partial_key]) {
        option = overrides[partial_key];
      } else if(option.custom) {
        option.value = mutationCard.custom[getCustomKey(partial_key)];
      }

      card.meta[getOptionKey(partial_key, option)] = true;
      return option;
    })
  });

  const custom = getCustom(card, plugins);
  const score = getScore(card, plugins);
  return {...card, custom, score};
}

function generateBlankCard(text, style = {}) {
  return {
    id: getId(),
    chunks: chunkText(text),
    meta: {},
    style: {...style},
    props: {},
    classNames: []
  }
}

function getMetaOption(options, partial_key, meta) {
  return _.find(options, option => {
    return !!meta[getOptionKey(partial_key, option)]
  })
}

function getWeightedOption(options, partial_key, registry) {
  const keys = options.map(option => getOptionKey(partial_key, option));
  const weights = keys.map(key => registry[key]);
  const index = weightedRandom(weights);
  return options[index];
}

function getPartialKey(plugin, param_name) {
  return `${plugin.name}-${param_name}`;
}

function getOptionKey(partial_key, option) {
  return `${partial_key}-${option.label}`;
}

function getCustomKey(partial_key) {
  return `custom-${partial_key}`;
}

function getId(meta, custom) {
  return id++;
}

function filterPlugins(plugins, registry) {
  return _.filter(plugins, p => (
    registry[F.pluginActivationKey(p.name)]
  ))
}

function getCustom(chunks, plugins) {
  const custom = {};
  _.forEach(plugins, plugin => {
    _.forEach(plugin.getCustomValues(chunks), (value, param) => {
      custom[getCustomKey(getPartialKey(plugin, param))] = value;
    })
  })
  return custom;
}

function getScore(chunks, plugins) {
  let score = 0;
  _.forEach(plugins, plugin => { score += plugin.score(chunks)})
  return score;
  // return _.sumBy(plugins, plugin => plugin.score(chunks)); // TODO: Why didn't this work?
}
