import React, { useCallback } from 'react';
import { useSet } from 'react-use';
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

  let className = classes.root;

  let [isFavorite, setFuncs] = useSet(new Set([]));

  // Add classes to highlight matched difficulty levels
  // How this will work?
  //  - difficulty-2 on top class -> difficulty-2 in lower class via CSS rules.
  if (filters.difficulty) {
    for (let i = filters.difficulty[0]; i <= filters.difficulty[1]; i++) {
      className += ` difficulty-filter-${i}`;
    }
  }

  const onToggleFavorite = useCallback((songId) => {
    setFuncs.toggle(songId);
  }, []);

  return (
    <List className={className}>
      {collections.map(collection => (<>
        <CollectionRow key={`crow-${collection.id}`}
          collection={collection}></CollectionRow>
        {collection.songs.map(song => (
          <SongRow
            key={`songrow-${song.id}`}
            song={song}
            showNoteCounts={filters.showNoteCounts}
            favorite={isFavorite.has(song.id)}
            onToggleFavorite={onToggleFavorite}
          ></SongRow>
        ))}
        <Divider />
      </>))}
    </List>
  );
}