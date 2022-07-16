type ChunirecDifficulty = "ULT" | "MAS" | "EXP" | "ADV" | "BAS"

type ThemeNames = string

type SongDataTypes = "intl" | "jp"

type ShownTabs = "best" | "recent"

type StoredWritable<T> = import("svelte/store").Writable<T> & {
    reset()
    toggle()
} 

interface Theme {
    text, text_dim, text_control, rank_b30, link, label,
    bg_main, bg_sub, bg_control, border,
    honor_normal, honor_bronze, honor_silver, honor_gold, honor_platina, honor_rainbow,
    song_ult, song_mas, song_exp, song_adv, song_bas,
    clear_aj, clear_fc
}

interface RawChuniRecord {
    title: string
    score: number
    difficulty: ChunirecDifficulty
    idx: string
    clear: "" | "AJ" | "FC"
}

type ChuniRecord = {
    const: number
    rank: number
    rating: number
    playCount?: number
    order?: number
} & RawChuniRecord

interface ChuniPlayerStats {
    name: string
    honor: { text: string, type: string }
    rating: string
    ratingMax: string
}