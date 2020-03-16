import songData from '../SongData';

// Given a string difficulty and a filter, return true if the difficulty
// matches the filter. The filter should be an array of two values
// (min and max difficulty) with extra difficulties such as 'L' represented
// as one level higher than the largest known numeric difficulty.
export function matchDifficulty(strDiff, filter) {
  // Some difficulties are missing, in which case we don't match.
  if (strDiff === null) return false;

  if (filter == null) return false;

  let intDiff = difficultyAsNumber(strDiff);
  return (intDiff >= filter[0]
    && intDiff <= filter[1]);
}

// Convert a string difficulty to a number. Extra difficulties
// such as 'L' are treated as one number higher than the largest
// known numeric difficulty.
export function difficultyAsNumber(strDiff) {
  // Some difficulties are missing.
  if (strDiff === null) return null;

  let intDiff = +strDiff;

  // Treat 'special' difficulties such as M or L as one level
  // more difficult than usual.
  // HACK: >20 to treat '01001001' difficulty as special (zeroichi)
  if (isNaN(intDiff) || intDiff > 20) {
    intDiff = songData.maxNumericDifficulty() + 1;
  }
  return intDiff;
}