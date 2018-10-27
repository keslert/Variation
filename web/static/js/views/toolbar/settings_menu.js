import React from 'react';
import { connect } from 'react-redux';
import Actions from '../../actions/interface';
import Menu, {SubMenu, MenuItem} from 'rc-menu';

const SettingsMenu = ({
  speeds,
  cards,
  imageUrl,
  timerInterval,
  numVisibleCards,
  setTimerInterval,
  setVisibleCards,
  setImageUrl,
}) => (

  <Menu mode="horizontal"
        openSubMenuOnMouseEnter={false}
        selectedKeys={[`time-${timerInterval}`, `cards-${numVisibleCards}`]}
        onSelect={({key}) => {
          if(key.startsWith('time')) {
            const interval = parseInt(key.split('-')[1]);
            setTimerInterval(interval);
          } else if(key.startsWith('cards')) {
            const cards = parseInt(key.split('-')[1]);
            setVisibleCards(cards)
          } else if(key == 'image') {
            vex.dialog.open({
              message: 'Enter an image url:',
              input: `<input name="url" class="form-control" value="${imageUrl}" />`,
              buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                  text: 'Save'
                }), $.extend({}, vex.dialog.buttons.NO, {
                  text: 'Cancel'
                })
              ],
              callback: (data) => {
                data && setImageUrl(data.url)
              }
            })
          }
        }}>
    <SubMenu title="Settings">

      <SubMenu title="Speed">
        {_.map(speeds, ({text, interval}) => (
          <MenuItem key={`time-${interval}`}>
            {text}
          </MenuItem>
        ))}
      </SubMenu>

      <SubMenu title="Cards">
        {_.map(cards, ({text, value}) => (
          <MenuItem key={`cards-${value}`}>
            {text}
          </MenuItem>
        ))}
      </SubMenu>

      <MenuItem key="image">
        Change Image
      </MenuItem>

    </SubMenu>
  </Menu>
)

SettingsMenu.defaultProps = {
  speeds: [
    {text: 'Slow', interval: 4000},
    {text: 'Medium', interval: 3000},
    {text: 'Fast', interval: 2000},
    {text: 'Rapid', interval: 1000},
  ],
  cards: [
    {text: '1', value: 1},
    {text: '2', value: 2},
    {text: '6', value: 6}
  ]
}

const mapStateToProps = (state) => ({
  timerInterval: state.interface.timerInterval,
  numVisibleCards: state.interface.numVisibleCards,
  imageUrl: state.interface.imageUrl,
});

const mapDispatchToProps = (dispatch) => ({
  setTimerInterval(interval) {
    dispatch(Actions.setTimerInterval(interval));
  },
  setVisibleCards(max) {
    dispatch(Actions.setMaxVisibleCards(max));
  },
  setImageUrl(url) {
    dispatch(Actions.setImageUrl(url));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMenu);
