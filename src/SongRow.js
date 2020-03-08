import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid,  Typography, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';

import DifficultyScores from './DifficultyScores';

const useStyles = makeStyles(theme => ({
  time: {
    color: 'gray',
    fontSize: '80%',
    margin: theme.spacing(1),
  }
}));

function SongRow({ song, filters }) {
  const classes = useStyles();
  const secondary = song.artist + (filters.showNoteCounts ? ` (${song.time})` : '');

  return (
    <ListItem divider>
      <ListItemText primary={song.name} secondary={secondary} />
      <ListItemSecondaryAction>
        <Grid container direction="column">
          <Grid container spacing={1} direction="row" justify="flex-end">
            <DifficultyScores
              filter={filters.difficulty}
              scores={song.difficulty}
              noteCounts={song.notecounts}
              showNoteCounts={filters.showNoteCounts} />
          </Grid>
          {filters.showNoteCounts ? null : (
            <Grid container spacing={1} direction="row" justify="flex-end">
              <Typography className={classes.time}>{song.time}</Typography>
            </Grid>
          )}
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default SongRow;