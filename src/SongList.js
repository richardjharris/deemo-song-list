import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, List } from '@material-ui/core';

import CollectionRow from './CollectionRow';
import SongRow from './SongRow';

export default function SongList(props) {
  const collections = props.collections;
  const filters = props.filters;
  const favorites = props.favorites;
  const onToggleFavorite = props.onToggleFavorite;

  const items = collections.map(collection => [
    <CollectionRow key={`collection-row-${collection.id}`}
      collection={collection}></CollectionRow>,
    collection.songs.map(song => (
      <SongRow
        key={`song-row-${song.id}`}
        song={song}
        showNoteCounts={filters.showNoteCounts}
        favorite={favorites[song.id]}
        onToggleFavorite={onToggleFavorite}
      ></SongRow>
    )),
    <Divider key={`divider-${collection.id}`} />
  ].flat()).flat();

  return (
    <div style={{ height: '100vh' }}>
      <List dense={false}>{items}</List>
    </div>
  );
}