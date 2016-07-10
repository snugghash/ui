import React from 'react';
import { connect } from 'react-redux';
import { createTable, TableContainer } from '../../Table';
import {
  getPlayerMatches,
  setPlayerMatchesSort,
  getPlayerHeroes,
  setPlayerHeroesSort,
} from '../../../actions';
import { playerMatchesColumns, playerHeroesOverviewColumns } from '../../Table/columnDefinitions';
import {
  sortPlayerMatches,
  transformPlayerMatchesById,
  sortPlayerHeroes,
  transformPlayerHeroesById,
} from '../../../selectors';
import { playerMatches, playerHeroes } from '../../../reducers';
import styles from './Overview.css';

const PlayerMatchesTable = createTable(
  playerMatches.getPlayerMatchesById,
  (state, sortState, playerId) => (sortState ? sortPlayerMatches(playerId)(state) : transformPlayerMatchesById(playerId)(state)),
  setPlayerMatchesSort
);
const PlayerHeroesTable = createTable(
  playerHeroes.getPlayerHeroesById,
  (state, sortState, playerId) => (sortState ? sortPlayerHeroes(playerId)(state) : transformPlayerHeroesById(playerId)(state)),
  setPlayerHeroesSort
);

const Overview = ({ playerId }) => (
  <div className={styles.overviewContainer}>
    <TableContainer title="recent matches" style={{ width: '75%' }}>
      <PlayerMatchesTable columns={playerMatchesColumns} id={playerId} />
    </TableContainer>
    <TableContainer title="hero stats" style={{ marginLeft: 30, width: '25%' }}>
      <PlayerHeroesTable columns={playerHeroesOverviewColumns} id={playerId} numRows={20} />
    </TableContainer>
  </div>
);

const getData = props => {
  props.getPlayerMatches(props.playerId, 20);
  props.getPlayerHeroes(props.playerId);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId) {
      getData(this.props);
    }
  }

  render() {
    return <Overview {...this.props} />;
  }
}

const mapDispatchToProps = (dispatch) => ({
  getPlayerMatches: (playerId, numMatches) => dispatch(getPlayerMatches(playerId, numMatches)),
  getPlayerHeroes: (playerId) => dispatch(getPlayerHeroes(playerId)),
});

export default connect(null, mapDispatchToProps)(RequestLayer);