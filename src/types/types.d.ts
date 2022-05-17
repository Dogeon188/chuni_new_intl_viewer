type ChunirecDifficulty = "ULT" | "MAS" | "EXP" | "ADV" | "BAS"

interface ChuniRecord {
    title: string;
    score: number;
    difficulty: ChunirecDifficulty;
    const: number;
    rank: number;
    rating: number;
    clear: "AJ" | "FC" | null;
}

interface ChuniPlayerStats {
    name: string;
    honor: {text: string, type: string};
    rating: string;
}