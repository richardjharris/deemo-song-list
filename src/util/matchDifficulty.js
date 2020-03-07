import songData from '../SongData';

export function matchDifficulty(songDiff, filter) {
  // Some difficulties are missing, in which case we don't match.
  if (songDiff === null) return false;

  if (filter == null) return false;

  // Treat 'special' difficulties such as M or L as one level
  // more difficult than usual.
  // HACK >20 to handle 01001001 difficulty
  let intDiff = +songDiff;
  if (isNaN(intDiff) || intDiff > 20) {
    intDiff = songData.maxNumericDifficulty() + 1;
  }
  return (intDiff >= filter[0]
    && intDiff <= filter[1]);
}