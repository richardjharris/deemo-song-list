import React from 'react';
import { ListSubheader } from "@material-ui/core";

// Renders a bar that indicates the collection's position in the total
// set of collections, to make it easier to scroll to in the game.
// index: position of this collection in the set (0-indexed)
// totalCollections: total number of collections
function CollectionPositionBar(index, totalCollections) {
  const barWidth = 10;
  const barHeight = 0.15;
  const pipStart = (index / totalCollections) * barWidth;

  // This is the 'true' width of the pip, e.g. if there are 10 collections, it will
  // be 10% of the bar width. However, we then scale it up to make it easier to see.
  const pipWidth = barWidth / totalCollections;

 return (<div style={{
    width: `${barWidth}em`,
    height: `${barHeight}em`,
    backgroundColor: '#bebeff',
    // center align, and move closer to the collection name (higher)
    margin: '-0.5em auto 0.5em auto',
  }}>
    <div style={{
      position: 'relative',
      top: `-${pipWidth / 1.5}em`,
      left: `${pipStart}em`,
      width: `${pipWidth * 2}em`, 
      height: `${pipWidth * 2}em`,
      backgroundColor: '#303f9f',
    }}>
      &nbsp;
    </div>
  </div>);

}

export default function CollectionRow(props) {
  const collection = props.collection;

  // Set background-color, otherwise sticky headers overlap
  return (
    <ListSubheader style={{background: 'white', paddingBottom: '1em'}}>
      {collection.name}
      {CollectionPositionBar(collection.index, collection.totalCollections)}
    </ListSubheader>
  );
}