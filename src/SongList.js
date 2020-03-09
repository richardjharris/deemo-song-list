import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, List } from '@material-ui/core';

import CollectionRow from './CollectionRow';
import SongRow from './SongRow';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

export default function SongList(props) {
  const classes = useStyles();
  const collections = props.collections;
  const filters = props.filters;

  return (
  <List className={classes.root}>
    {collections.map(collection => (<>
      <CollectionRow key={`crow-${collection.id}`}
        collection={collection}></CollectionRow>
      {collection.songs.map(song => (
        <SongRow
          key={`songrow-${song.id}`}
          song={song}
          filters={filters}
        ></SongRow>
      ))}
      <Divider />
    </>))}
  </List>
  );
}