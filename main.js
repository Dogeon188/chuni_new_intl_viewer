import html2canvas from "html2canvas";

const Difficulty = {
    ultima: "ULT",
    master: "MAS",
    expert: "EXP",
    advance: "ADV",
    basic: "BAS"
}

const mainDiv = $("<div>");
const msgEl = $("<div>");

const strToNum = (str) => Number([...str].filter(e => e !== ",").join(""));

const getCookie = (key) => {
    const cookieEntry = document.cookie
        .split(";")
        .map(e => decodeURIComponent(e.trim()))
        .map(e => e.split("="))
        .find(e => e[0] === key);
    if (cookieEntry) return cookieEntry[1]; // value
    return "";
}

const getSongList = async (difficulty = Difficulty.master) => {
    const fd = new FormData();
    fd.append("genre", 99);
    fd.append("token", getCookie("_t"));
    const api = {
        [Difficulty.ultima]: "sendUltima",
        [Difficulty.master]: "sendMaster",
        [Difficulty.expert]: "sendExpert",
        [Difficulty.advance]: "sendAdvance",
        [Difficulty.basic]: "sendBasic"
    }
    const res = await fetch(`https://chunithm-net-eng.com/mobile/record/musicGenre/${api[difficulty]}`, {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    });
    const htmlStr = await res.text();
    const formList = [...($("<div>").html(htmlStr).find("form"))]
    formList.shift();
    return formList;
}

const ratingCalc = (score, chartConst) => {
    let offset = 0;

    if (score >= 1009000) {
        offset = 2.15;
    } else if (score >= 1007500) {
        offset = 2 + (score - 1007500) / 1500 * 0.15;
    } else if (score >= 1005000) {
        offset = 1.5 + (score - 1005000) / 2500 * 0.5;
    } else if (score >= 1000000) {
        offset = 1 + (score - 1000000) / 5000 * 0.5;
    } else if (score >= 975000) {
        offset = (score - 975000) / 25000;
    } else if (score >= 925000) {
        offset = -3 + (score - 925000) / 50000 * 3;
    } else if (score >= 900000) {
        offset = -5 + (score - 900000) / 25000 * 2;
    } else if (score >= 800000) {
        return (chartConst - 5) / 2 * (1 + (score - 800000) / 100000);
    } else if (score >= 500000) {
        return (chartConst - 5) / 2 * (score - 500000) / 300000;
    } else return 0;

    return Math.floor((chartConst + offset + Number.EPSILON) * 100) / 100;
}

const recordFetch = async () => {
    const ret = [];

    for (const difficulty of Object.values(Difficulty)) {
        msgEl.text(`Fetching play record (${difficulty})...`);
        const songList = await getSongList(difficulty);

        for (const songDataForm of songList) {
            const songData = $(songDataForm);
            const title = songData.find(".music_title").text();
            const scoreStr = songData.find(".text_b").length ? songData.find(".text_b").text() : null;
            const icons = songData.find(".play_musicdata_icon");
            let clear = null;
            if (icons.length) {
                for (const clearType of ["fullchain", "fullchain2", "alljustice", "fullcombo"]) {
                    clear = icons.find(`img[src*="${clearType}"]`);
                    if (clear.length) break;
                }
            }
            if (title && scoreStr) {
                ret.push({
                    title,
                    score: strToNum(scoreStr),
                    difficulty,
                    clear
                });
            }
        }
    }
    msgEl.text("Play record fetch done.");
    return ret;
}

const main = async () => {
    if (window.location.hostname !== "chunithm-net-eng.com") {
        alert("[chuni_intl_viewer] This tools could only be used under chunithm-net international.");
        window.location.href = "https://chunithm-net-eng.com/";
        return;
    }

    if (!getCookie("_t")) {
        alert("[chuni-intl-viewer] Token not found. Please login first.");
        window.location.href = "https://chunithm-net-eng.com/";
        return;
    }

    const recordList = await recordFetch();
    
    msgEl.text("Acquiring song data...");
    const musicData = await (await fetch("https://api.chunirec.net/2.0/music/showall.json?token=252db1d77e53f52fd85c5b346fef7c90e345b3b3f0b12018a2074298e4b35182&region=jp2")).json();
    msgEl.text("Acquiring song data done.");

    // just a temporary wordaround, not sure Valsqotch EXP's chart constant
    musicData.push({
        "meta": {
            "title": "Valsqotch",
            "genre": "ORIGINAL",
            "artist": "owl*tree feat. chi*tree",
            "release":"2022-03-04",
            "bpm": 125
        },
        "data": {
            "BAS":{"level":5,"const":0,"maxcombo":-1,"is_const_unknown":0},
            "ADV":{"level":8.5,"const":0,"maxcombo":-1,"is_const_unknown":0},
            "EXP":{"level":13.5,"const":13.5,"maxcombo":1402,"is_const_unknown":1},
            "MAS":{"level":14.5,"const":14.5,"maxcombo":1973,"is_const_unknown":0}
        }
    });

    // do rating calc for record list
    recordList.map(r => {
        const songInfo = musicData.find(md => md.meta.title === r.title);
        let songConst = songInfo.data[r.difficulty].const;
        if (songConst === 0) songConst = songInfo.data[r.difficulty].level;
        r.rating = ratingCalc(r.score, songConst);
        r.songConst = songConst;
        return r;
    });
    recordList.sort((a, b) => (b.rating === a.rating) ? (b.songConst - a.songConst) : (b.rating - a.rating));

    // Generate result
    const createTextDiv = (content = "") => $("<div>").text(content).css({
        textAlign: "left",
        margin: "0.5rem"
    });

    const resultDiv = $("<div>");

    const best30Sum = recordList.slice(0, 30)
        .map((r) => r.rating)
        .reduce((acc, val) => acc + val);

    resultDiv.append(
        createTextDiv(`Generated at: ${new Date().toLocaleDateString()}`),
        createTextDiv(`Best 30 Average: ${(best30Sum / 30).toFixed(2)}`),
        createTextDiv(`Maximum Achievable Rating: ${((best30Sum + recordList[0].rating * 10) / 40).toFixed(2)}`)
    );

    const table = $("<table>").css("width", "100%");
    const createRow = (dataArr, isHeader = false) => {
        const row = $("<tr>");
        const tag = isHeader ? "<th>" : "<td>";
        const difficultyColor = {
            [Difficulty.ultima]: "#3cf",
            [Difficulty.master]: "#c7f",
            [Difficulty.expert]: "#e46",
            [Difficulty.advance]: "#e73",
            [Difficulty.basic]: "#1c3"
        }[dataArr.pop()]
        for (const data of dataArr) {
            const item = $(tag);
            if (data instanceof $) item.append(data[0]);
            else item.text(data);
            item.css("padding", "0.5rem");
            row.append(item);
        }
        if (dataArr[0] <= 30) row.children().first().css("color", "#fc4");
        if (dataArr[0] <= 40) row.children().first().css("fontWeight", "bold");
        row.children().eq(1).css({
            color: difficultyColor,
            fontWeight: "bold"
        });
        return row;
    }

    const headerRow = ["#", "Song Name", "Constant", "Score", "Rating", "FC/AJ", "Difficulty"];
    table.append(createRow(headerRow, true));

    for (const [i, r] of recordList.entries()) {
        const rowData = [i + 1, r.title, r.songConst.toFixed(1), r.score, r.rating.toFixed(2), r.clear, r.difficulty];
        table.append(createRow(rowData));
    }
    table.children(":odd").css("backgroundColor", "#324");
    resultDiv.append(table);
    msgEl.hide();

    mainDiv.prepend(
        $("<button>")
            .text("Donwload Best 40 Scores as PNG")
            .css("margin", "0.5rem")
            .click(async () => {
                $("<a>").attr({
                    download: "result_b40.png",
                    href: (await html2canvas(resultDiv[0], {
                        backgroundColor: "#223",
                        onclone: (d, e) => {
                            const trs = e.querySelector(":last-child").children;
                            for (;trs.length > 41;) trs[41].remove();
                        }
                    })).toDataURL()
                })[0].click();
            }),
        $("<button>")
            .text("Donwload Full Result as PNG")
            .css("margin", "0.5rem")
            .click(async () => {
                $("<a>").attr({
                    download: "result_full.png",
                    href: (await html2canvas(resultDiv[0], {backgroundColor: "#223"})).toDataURL()
                })[0].click();
            }),
        resultDiv
    );

    const titleDiv = $("<div>");
    const h3 = $("<h3>").text("Chunithm (International) Score Viewer");
    const githubContact = $("<a>").attr({
        href: "https://github.com/Dogeon188/chuni_new_intl_viewer",
        target: "_blank",
        rel: "noopener noreferrer"
    }).text("Dogeon188/chuni_new_intl_viewer@GitHub")
    titleDiv.append(h3, githubContact);
    mainDiv.prepend(titleDiv);
};

if (window.chuniIntlViewer) {
    alert("[chuni-intl-viewer] Please refresh the page before another new fetch.");
} else {
    window.chuniIntlViewer = true;
    msgEl.css({
        fontSize: "1.5rem",
        padding: "1rem"
    });
    mainDiv.append(msgEl).css({
        padding: "0.1rem",
        backgroundColor: "#223",
        color: "#eec",
        width: "fit-content",
        minWidth: "100%"
    });
    $(document.body).prepend(mainDiv);
    try {
        main();
    } catch (error) {
        msgEl.text("An error occured! Please contact the author and report the bug report below. Your response would make Chunithm Viewer better!\n" + error);
    }
}

