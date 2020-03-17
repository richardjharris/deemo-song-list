import React, { useCallback } from 'react';
import { useSet } from 'react-use';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, List } from '@material-ui/core';
import { AutoSizer, List as VirtualList, CellMeasurer, CellMeasurerCache, WindowScroller } from 'react-virtualized';

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

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 90,
});
let items = [];

const renderRow = ({ index, parent, key, style }) => (
  <CellMeasurer
    key={key}
    cache={cellMeasurerCache}
    parent={parent}
    columnIndex={0}
    rowIndex={index}
    keyMapper={(index) => items[index].key}
  >
    <div style={style}>{items[index]}</div>
  </CellMeasurer>
);

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
    // setFuncs should not be added to the dependency list, as it
    // undoes SongRow's memoization.
  }, []);

  items = collections.map(collection => [
    <CollectionRow key={`collection-row-${collection.id}`}
      collection={collection}></CollectionRow>,
    collection.songs.map(song => (
      <SongRow
        key={`song-row-${song.id}`}
        song={song}
        showNoteCounts={filters.showNoteCounts}
        favorite={isFavorite.has(song.id)}
        onToggleFavorite={onToggleFavorite}
      ></SongRow>
    )),
    <Divider key={`divider-${collection.id}`} />
  ].flat()).flat();

  const renderList = () => (
    <WindowScroller scrollElement={window}>
      {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <div ref={registerChild}>
              <VirtualList
                autoHeight
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={items.length}
                width={width}
                height={height}
                deferredMeasurementCache={cellMeasurerCache}
                rowHeight={cellMeasurerCache.rowHeight}
                rowRenderer={renderRow}
                overscanRowCount={5}
                scrollTop={scrollTop}
              />
            </div>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  )

  return (
    <div style={{ height: '100vh' }}>
      <List dense={false} component={renderList} />
    </div>
  );
}