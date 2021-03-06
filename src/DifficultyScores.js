import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import chroma from 'chroma-js';

import { difficultyAsNumber } from './util/matchDifficulty';
import { formatInteger } from './util/formatNumber';

const useStyles = makeStyles(theme => ({
  difficultySquare: {
    ...theme.typography.button,
    margin: theme.spacing(1),
    border: '1px solid transparent',
    width: '1.8rem',
    maxWidth: '1.8rem',
    height: '1.8rem',
    maxHeight: '1.8rem',
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: '1.8rem',
  },
  difficultySquareWithNoteCount: {
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
  },
  noteCount: {
    fontSize: '70%',
  },
}));

const easyGreen = 'rgb(197,244,197)';
const normalBlue = 'rgb(197,197,244)';
const hardGold = '#f6dd58';
const extraWhite = 'white';

const difficultyColors = [easyGreen, normalBlue, hardGold, extraWhite];
const darkColors = difficultyColors.map(c => chroma(c).darken(1.2).css());

function DifficultyScores(props) {
  const { scores, noteCounts, showNoteCounts } = props;
  const classes = useStyles();

  console.log("Rendering difficulty scores", scores);

  // First build the difficulty squares
  const diffSquares = [0,1,2,3].filter(i => scores[i] !== null).map((i) => {
      let className = classes.difficultySquare
                    + ` difficulty-${difficultyAsNumber(scores[i])}`;

      if (showNoteCounts) {
        // Reduce bottom padding
        className += ` ${classes.difficultySquareWithNoteCount}`;
      }

      let style = {
        backgroundColor: difficultyColors[i],
        borderColor: darkColors[i],
      }
      if (scores[i].length > 2) {
        style.fontSize = '50%';
      }

      return (<Typography key={i}
        className={className}
        style={style}>
        {scores[i]}
      </Typography>);
  });

  if (showNoteCounts) {
    const countSquares = [0,1,2,3].filter(i => noteCounts[i] !== null).map((i) => {
      let color = darkColors[i];

      return (<span key={i}
        className={classes.noteCount}
        style={{ color }}>
          {formatInteger(noteCounts[i])}
        </span>);
    });

    return (<table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr key="scores">{diffSquares.map((sq) => 
          <td key={sq.key}>{sq}</td>
        )}</tr>
        <tr key="notes">{countSquares.map((c) =>
          <td style={{ padding: 0 }} key={c.key}>{c}</td>
        )}</tr>
      </tbody>
    </table>);
  }
  else {
    // Render a simple list
    return diffSquares;
  }
}

const ex = React.memo(DifficultyScores);
export default ex;