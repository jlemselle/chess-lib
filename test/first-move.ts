import { firstMove, Player } from "../src/lib"

test('first move should be white', () => {
    expect(firstMove).toBe(Player.WHITE)
})