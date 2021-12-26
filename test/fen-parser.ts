import { a6, a7, a8, e3, f6, h8, squareMap } from "../src/squares";

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
          pawn: 0,
          knight: 0,
          bishop: 0,
          rook: 0,
          queen: 0,
          king: 0,
        },
        castling: {
          kingside: castling.includes("K"),
          queenside: castling.includes("Q"),
        },
      },
      black: {
        piecePlacement: {
          pawn: 0,
          knight: 0,
          bishop: this.parsePiece(piecePlacement, "b"),
          rook: this.parsePiece(piecePlacement, "r"),
          queen: 0,
          king: 0,
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
    return board
      .split("/")
      .map((rank, index) => {
        return this.parseRank(rank, piece) << index;
      })
      .reduce((a, b) => a | b);
  }

  private parseRank(rank: string, piece: string): number {
    return Array.from(this.expandRank(rank))
      .map((square, index) => {
        if (square === piece) {
          return 1 << index;
        } else {
          return 0;
        }
      })
      .reduce((a, b) => a | b);
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
      bishop: a6 | f6,
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
].forEach((testCase) => {
  test("piece placement - rook parsing", () => {
    const parser: FenParser = new FenParser();
    const result = parser.parse(testCase.fen);
    expect(result.black.piecePlacement).toEqual(testCase.black);
    expect(result.white.piecePlacement).toEqual(testCase.white);
  });
});
