import {
  a1,
  a2,
  a6,
  a7,
  a8,
  b1,
  b2,
  b7,
  b8,
  c1,
  c2,
  c7,
  c8,
  d1,
  d2,
  d7,
  d8,
  e1,
  e2,
  e3,
  e7,
  e8,
  f1,
  f2,
  f6,
  f7,
  f8,
  g1,
  g2,
  g7,
  g8,
  h1,
  h2,
  h7,
  h8,
  squareMap,
} from "../src/squares";

interface PiecePlacement {
  pawn: number;
  knight: number;
  bishop: number;
  rook: number;
  queen: number;
  king: number;
}

interface Castling {
  kingside: boolean;
  queenside: boolean;
}

interface Colour {
  piecePlacement: PiecePlacement;
  castling: Castling;
}

interface Board {
  white: Colour;
  black: Colour;
  active: string;
  enPassant?: number;
  fiftyMoveRule: number;
  move: number;
}

class FenParser {
  parse(raw: string): Board {
    const parts = raw.split(" ");
    const piecePlacement = parts[0];
    const active = parts[1];
    const castling = parts[2];
    const enPassant = parts[3];
    const fiftyMoveRule = parts[4];
    const move = parts[5];

    return {
      white: {
        piecePlacement: {
          pawn: this.parsePiece(piecePlacement, "P"),
          knight: this.parsePiece(piecePlacement, "N"),
          bishop: this.parsePiece(piecePlacement, "B"),
          rook: this.parsePiece(piecePlacement, "R"),
          queen: this.parsePiece(piecePlacement, "Q"),
          king: this.parsePiece(piecePlacement, "K"),
        },
        castling: {
          kingside: castling.includes("K"),
          queenside: castling.includes("Q"),
        },
      },
      black: {
        piecePlacement: {
          pawn: this.parsePiece(piecePlacement, "p"),
          knight: this.parsePiece(piecePlacement, "n"),
          bishop: this.parsePiece(piecePlacement, "b"),
          rook: this.parsePiece(piecePlacement, "r"),
          queen: this.parsePiece(piecePlacement, "q"),
          king: this.parsePiece(piecePlacement, "k"),
        },
        castling: {
          kingside: castling.includes("k"),
          queenside: castling.includes("q"),
        },
      },
      active: active === "w" ? "white" : "black",
      enPassant: squareMap[enPassant],
      fiftyMoveRule: +fiftyMoveRule,
      move: +move,
    };
  }

  private parsePiece(board: string, piece: string): number {
    const result = board
      .split("/")
      .map((rank, index) => {
        const rankValue = this.parseRank(rank, piece) << (index * 8);
        return rankValue;
      })
      .reduce((a, b) => i64or(a, b));
    return result;
  }

  private parseRank(rank: string, piece: string): number {
    const expandedRank = this.expandRank(rank);
    const result = Array.from(expandedRank).map((square, index) => {
      if (square === piece) {
        return 1 << index;
      } else {
        return 0;
      }
    });

    return result.reduce((a, b) => i64or(a, b));
  }

  private expandRank(rank: string): string {
    return Array.from(rank)
      .flatMap((char) => {
        if ("0123456789".includes(char)) {
          return " ".repeat(+char);
        } else {
          return char;
        }
      })
      .join("");
  }
}

[
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 0",
    move: 0,
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 1",
    move: 1,
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 58",
    move: 58,
  },
].forEach((testCase) => {
  test("move parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.move).toBe(testCase.move);
  });
});

[
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 0",
    fiftyMoveRule: 0,
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 1 0",
    fiftyMoveRule: 1,
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 58 0",
    fiftyMoveRule: 58,
  },
].forEach((testCase) => {
  test("fifty-move rule parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.fiftyMoveRule).toBe(testCase.fiftyMoveRule);
  });
});

[
  {
    fen: "8/8/8/8/8/8/8/8 w - e3 0 0",
    enPassant: e3,
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 0",
    enPassant: undefined,
  },
].forEach((testCase) => {
  test("en passant parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.enPassant).toBe(testCase.enPassant);
  });
});

[
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 0",
    active: "white",
  },
  {
    fen: "8/8/8/8/8/8/8/8 b - - 0 0",
    active: "black",
  },
].forEach((testCase) => {
  test("active parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.active).toBe(testCase.active);
  });
});

[
  {
    fen: "8/8/8/8/8/8/8/8 w KQkq - 0 0",
    white: {
      kingside: true,
      queenside: true,
    },
    black: {
      kingside: true,
      queenside: true,
    },
  },
  {
    fen: "8/8/8/8/8/8/8/8 w Kq - 0 0",
    white: {
      kingside: true,
      queenside: false,
    },
    black: {
      kingside: false,
      queenside: true,
    },
  },
  {
    fen: "8/8/8/8/8/8/8/8 w - - 0 0",
    white: {
      kingside: false,
      queenside: false,
    },
    black: {
      kingside: false,
      queenside: false,
    },
  },
].forEach((testCase) => {
  test("castling parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.white.castling).toEqual(testCase.white);
    expect(result.black.castling).toEqual(testCase.black);
  });
});

[
  {
    fen: "r6r/8/8/8/8/8/8/8 w - - 0 0",
    black: {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: a8 | h8,
      queen: 0,
      king: 0,
    },
    white: {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    },
  },
  {
    fen: "2b2b2/8/8/8/8/8/8/8 w - - 0 0",
    black: {
      pawn: 0,
      knight: 0,
      bishop: c8 | f8,
      rook: 0,
      queen: 0,
      king: 0,
    },
    white: {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    },
  },
  {
    fen: "8/pppppppp/8/8/8/8/8/9 w - - 0 0",
    black: {
      pawn: a7 | b7 | c7 | d7 | e7 | f7 | g7 | h7,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    },
    white: {
      pawn: 0,
      knight: 0,
      bishop: 0,
      rook: 0,
      queen: 0,
      king: 0,
    },
  },
  {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 0",
    black: {
      pawn: a7 | b7 | c7 | d7 | e7 | f7 | g7 | h7,
      knight: b8 | g8,
      bishop: c8 | f8,
      rook: a8 | h8,
      queen: d8,
      king: e8,
    },
    white: {
      pawn: squares(a2, b2, c2, d2, e2, f2, g2, h2),
      knight: squares(b1, g1),
      bishop: squares(c1, f1),
      rook: squares(a1, h1),
      queen: squares(d1),
      king: squares(e1),
    },
  },
].forEach((testCase) => {
  test("piece placement", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.black.piecePlacement).toEqual(testCase.black);
    expect(result.white.piecePlacement).toEqual(testCase.white);
  });
});

function squares(...squares: number[]): number {
  return squares.reduce((a, b) => Number(BigInt(a) | BigInt(b)));
}

function i64or(a: number, b: number): number {
  return Number(BigInt(a) | BigInt(b));
}
