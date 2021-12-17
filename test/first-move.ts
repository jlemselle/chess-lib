import { firstMove, Player, pos, startingPosition } from "../src/lib"

test('first move should be white', () => {
    expect(firstMove).toBe(Player.WHITE)
})

test('starting position should be 64 squares', () => {
    expect(startingPosition.length).toBe(64);
})

test('should have starting position', () => {
    expect(startingPosition).toEqual(pos(`
        rnbqkbnr
        pppppppp
        ........
        ........
        ........
        ........
        PPPPPPPP
        RNBQKBNR
    `));
})