type ChunirecDifficulty = "ULT" | "MAS" | "EXP" | "ADV" | "BAS"

type ThemeNames = "Dark" | "Light" | "Purple"

interface Theme {
    text, text_dim, link, label,
    bg_main, bg_sub, border,
    honor_normal, honor_bronze, honor_silver, honor_gold, honor_rainbow,
    song_ult, song_mas, song_exp, song_adv, song_bas,
    clear_aj, clear_fc,
    rank_b30,
    switch_on, switch_fill
}

interface ChuniRecord {
    title: string;
    score: number;
    difficulty: ChunirecDifficulty;
    const: number;
    rank: number;
    rating: number;
    clear: "AJ" | "FC" | "";
}

interface ChuniPlayerStats {
    name: string;
    honor: { text: string, type: string };
    rating: string;
}