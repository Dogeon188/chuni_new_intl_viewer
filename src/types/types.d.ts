type ChunirecDifficulty = "ULT" | "MAS" | "EXP" | "ADV" | "BAS"

interface ChuniRecord {
    title: string;
    score: number;
    difficulty: ChunirecDifficulty;
    const: number;
    rank: number;
    rating: number;
    clear: string | null;
}

interface ChuniPlayerStats {
    name: string;
    honor: string;
    rating: string;
}