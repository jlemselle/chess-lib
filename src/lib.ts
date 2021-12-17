export enum Player {
    WHITE, BLACK
}

export enum PieceType {
    PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING
}

export interface Piece {
    type: PieceType,
    player: Player
}

export const firstMove = Player.WHITE;

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

/**
 * Create a chess board from a plain string.
 * @param raw 
 */
export function pos(raw: string): (Piece | undefined)[] {
    const whitespaceRemoved = raw.replace(/\s/gm, '');
    return Array(...whitespaceRemoved).map(c => charToPiece(c));
}

function charToPiece(char: string): Piece | undefined {
    const type =
        ['P', 'p'].includes(char) ? PieceType.PAWN
            : ['N', 'n'].includes(char) ? PieceType.KNIGHT
                : ['B', 'b'].includes(char) ? PieceType.BISHOP
                    : ['R', 'r'].includes(char) ? PieceType.ROOK
                        : ['Q', 'q'].includes(char) ? PieceType.QUEEN
                            : ['K', 'k'].includes(char) ? PieceType.KING
                                : undefined

    const player =
        ['P', 'N', 'B', 'R', 'Q', 'K'].includes(char) ? Player.WHITE
            : ['p', 'n', 'b', 'r', 'q', 'k'].includes(char) ? Player.BLACK
                : undefined;

    if (type !== undefined && player !== undefined) {
        return { type, player }
    }

    return undefined;
}