export enum Player {
  WHITE,
  BLACK,
}

export enum PieceType {
  PAWN,
  KNIGHT,
  BISHOP,
  ROOK,
  QUEEN,
  KING,
}

export interface Piece {
  type: PieceType;
  player: Player;
  position: number;
}

export const firstMove = Player.WHITE;

type Position = Piece[];

export const startingPosition = pos(`
    rnbqkbnr
    pppppppp
    ........
    ........
    ........
    ........
    PPPPPPPP
    RNBQKBNR
`);

export function possibleMoves(from: Position): Position[] {
  return [];
}

/**
 * Create a chess board from a plain string.
 * @param raw
 */
export function pos(raw: string): Position {
  return Array.from(
    raw.split("\n").reverse().join().replace(/\s/g, "")
  ).flatMap((char, index) => charToPiece(char, index));
}

function charToPiece(char: string, index: number): Piece[] {
  const type = charToPieceType(char);
  const player = charToPlayer(char);
  const position = 1 << index;

  if (type !== undefined && player !== undefined) {
    return [{ type, player, position }];
  }

  return [];
}

function charToPieceType(char: string): PieceType | undefined {
  return ["P", "p"].includes(char)
    ? PieceType.PAWN
    : ["N", "n"].includes(char)
    ? PieceType.KNIGHT
    : ["B", "b"].includes(char)
    ? PieceType.BISHOP
    : ["R", "r"].includes(char)
    ? PieceType.ROOK
    : ["Q", "q"].includes(char)
    ? PieceType.QUEEN
    : ["K", "k"].includes(char)
    ? PieceType.KING
    : undefined;
}

function charToPlayer(char: string): Player | undefined {
  return ["P", "N", "B", "R", "Q", "K"].includes(char)
    ? Player.WHITE
    : ["p", "n", "b", "r", "q", "k"].includes(char)
    ? Player.BLACK
    : undefined;
}
