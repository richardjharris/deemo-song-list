import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, IconButton, Typography, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DifficultyScores from './DifficultyScores';

const useStyles = makeStyles(theme => ({
  time: {
    color: 'gray',
    fontSize: '80%',
    margin: theme.spacing(1),
  }
}));

function SongRow({ song, showNoteCounts, favorite, onToggleFavorite }) {
  const classes = useStyles();
  const secondary = song.artist + (showNoteCounts ? ` (${song.time})` : '');
  console.log(`Rendering ${song.name} fav=${favorite}`);

  return (
    // <div> is required to avoid bullet points appearing when we are using
    // AutoSizer.
    <ListItem divider ContainerComponent="div">
      <ListItemIcon>
        <IconButton
          onClick={() => onToggleFavorite(song.id)}
          aria-label={favorite ? "mark as favorite" : "unmark as favorite"}
        >
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </ListItemIcon>
      <ListItemText primary={song.name} secondary={secondary} />
      <ListItemSecondaryAction>
        <Grid container direction="column">
          <Grid container spacing={1} direction="row" justify="flex-end">
            <DifficultyScores
              scores={song.difficulty}
              noteCounts={song.notecounts}
              showNoteCounts={showNoteCounts} />
          </Grid>
          {showNoteCounts ? null : (
            <Grid container spacing={1} direction="row" justify="flex-end">
              <Typography className={classes.time}>{song.time}</Typography>
            </Grid>
          )}
        </Grid>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

function areEqual(prev, next) {
  return prev.song.id === next.song.id
    && prev.favorite === next.favorite
    && prev.showNoteCounts === next.showNoteCounts;
}

export default React.memo(SongRow, areEqual);