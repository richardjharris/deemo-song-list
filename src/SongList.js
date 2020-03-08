import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Divider } from '@material-ui/core';
import AutoSizer from 'react-virtualized-auto-sizer';

import CollectionRow from './CollectionRow';
import SongRow from './SongRow';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
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

  // div wrappers are to force AutoSizer to fill the screen, may not be
  // needed.
  return (
    <div style={{display: 'flex'}}>
    <div style={{flex: '1 1 auto', height: '100vh', width: '100vh'}}>
    <AutoSizer disableWidth>
      {({ height, width }) => (
        <List
          className={classes.root}
          width={width}
          height={height}>
          {collections.map(collection => (
            <li key={`collection-${collection.id}`}
              className={classes.listSection}>
              <ul className={classes.ul}>
                <CollectionRow key={`crow-${collection.id}`}
                  collection={collection}></CollectionRow>
                {collection.songs.map(song => (
                  <SongRow
                    key={`songrow-${song.id}`}
                    song={song}
                    filters={filters}
                  ></SongRow>
                ))}
              </ul>
              <Divider />
            </li>
          ))}
      </List>
      )}
    </AutoSizer>
    </div>
    </div>
  );
}