// API to the (internally baked) list of songs.
import _jsonData from './songs.json';

class SongData {
  constructor() {
    var artistMap = {};
    var platformMap = {};
    var maxNumericDifficulty = 1;
    const collectionCount = Object.keys(_jsonData).length;
    var collectionIndex = 0;
    for (let collection of _jsonData) {
      for (const platform in collection.platforms) {
        platformMap[platform] = true;
      }

      // Include information about the collection's relative position,
      // to help the UI render it
      // TODO: ideally this should take into account the chosen device.
      collection['index'] = collectionIndex++;
      collection['totalCollections'] = collectionCount;

      for (let song of collection.songs) {
        artistMap[song.artist] = true;

        for (const score of song.difficulty) {
          var intScore = +score;
          // <= 20 prevents the 01000101 score being interpreted as a number
          if (intScore && intScore <= 20 && intScore > maxNumericDifficulty) {
            maxNumericDifficulty = intScore;
          }
        }

        // Creates a cycle, but it's okay as we only store this data once
        // for the lifetime of the app.
        song['collection'] = collection;

        // Give each song a unique ID for React key purposes
        song['id'] = collection.id + ' ' + song.name;
      }
    }

    const caseInsensitive = new Intl.Collator('en').compare;

    this._artistNames = Object.keys(artistMap).sort(caseInsensitive);
    this._maxNumericDifficulty = maxNumericDifficulty;
    this._collections = _jsonData;
    this._platforms = Object.keys(platformMap).sort(caseInsensitive);
  }

  maxNumericDifficulty() {
    return this._maxNumericDifficulty;
  }

  artists() {
    return this._artistNames;
  }

  collections() {
    return this._collections;
  }

  platforms() {
    return this._platforms;
  }
}

const songData = new SongData();
export default songData;