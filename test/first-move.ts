import {
  firstMove,
  Player,
  pos,
  possibleMoves,
  startingPosition,
} from "../src/lib";

test("first move should be white", () => {
  expect(firstMove).toBe(Player.WHITE);
});

// test("starting position should be 64 squares", () => {
//   expect(startingPosition.length).toBe(64);
// });

// test("should have starting position", () => {
//   expect(startingPosition).toEqual(
//     pos(`
//         rnbqkbnr
//         pppppppp
//         ........
//         ........
//         ........
//         ........
//         PPPPPPPP
//         RNBQKBNR
//     `)
//   );
// });

// test("e4 should be a valid move from starting position", () => {
//   const moves = possibleMoves(startingPosition);
//   expect(moves).toContainEqual(
//     pos(`
//         rnbqkbnr
//         pppppppp
//         ........
//         ........
//         ....P...
//         ........
//         PPPP.PPP
//         RNBQKBNR
//     `)
//   );
// });

// test("e3 should be a valid move from starting position", () => {
//   const moves = possibleMoves(startingPosition);
//   expect(moves).toContainEqual(
//     pos(`
//           rnbqkbnr
//           pppppppp
//           ........
//           ........
//           ........
//           ....P...
//           PPPP.PPP
//           RNBQKBNR
//       `)
//   );
// });
