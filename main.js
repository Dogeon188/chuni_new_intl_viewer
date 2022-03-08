import html2canvas from "html2canvas";

const Difficulty = {
    ultima: "ULT",
    master: "MAS",
    expert: "EXP",
    advance: "ADV",
    basic: "BAS"
}

const mainDiv = document.createElement("div");
const msgEl = document.createElement("div");

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
    const el = document.createElement("div");
    el.innerHTML = htmlStr;
    const frag = document.createDocumentFragment();
    frag.appendChild(el);
    const formList = [...frag.querySelectorAll("form")];
    formList.shift();
    return formList;
}

const ratingCalc = (score, songRating) => {
    let offset = 0;

    if (score >= 1009000) {
        offset = 2.15;
    } else if (score >= 1007500) {
        offset = 2 + (score - 1007500) * 5 / 50000;
    } else if (score >= 1005000) {
        offset = 1.5 + (score - 1005000) * 10 / 50000;
    } else if (score >= 1000000) {
        offset = 1 + (score - 1000000) * 5 / 50000;
    } else if (score >= 975000) {
        offset = (score - 975000) * 2 / 50000;
    } else if (score >= 950000) {
        offset = -1.5 + (score - 950000) * 3 / 50000;
    } else if (score >= 925000) {
        offset = -3 + (score - 925000) * 3 / 50000;
    } else {
        offset = -5 + (score - 900000) * 4 / 50000;
    }

    return Math.floor((songRating + offset) * 100) / 100;
}

const recordFetch = async () => {
    const ret = [];

    for (const difficulty of Object.values(Difficulty)) {
        msgEl.innerText = `Fetching play record (${difficulty})...`;
        const songList = await getSongList(difficulty);

        for (const songData of songList) {
            const title = songData.querySelector(".music_title").innerText;
            const scoreStr = songData.querySelector(".text_b") ? songData.querySelector(".text_b").innerText : null;
            const icons = songData.querySelector(".play_musicdata_icon");
            let clear = null;
            if (icons) for (const clearType of ["fullchain", "fullchain2", "alljustice", "fullcombo", "clear"]) {
                clear = icons.querySelector(`img[src*="${clearType}"]`);
                if (clear) break;
            }
            if (title && scoreStr) {
                ret.push({
                    title: songData.querySelector(".music_title").innerText,
                    score: strToNum(scoreStr),
                    difficulty,
                    clear
                });
            }
        }
    }
    msgEl.innerText = "Play record fetch done.";
    return ret;
}

const main = async () => {
    if (window.location.hostname !== "chunithm-net-eng.com") {
        alert("[chuni_intl_viewer] This tools could only be used under chunithm-net international.");
        window.location.href  = "https://chunithm-net-eng.com/";
        return;
    }

    if (!getCookie("_t")) {
        alert("[chuni-intl-viewer] Token not found. Please login first.");
        window.location.href  = "https://chunithm-net-eng.com/";
        return;
    }

    const recordList = await recordFetch();
    
    msgEl.innerText = "Acquiring song data...";
    const musicData = await (await fetch("https://api.chunirec.net/2.0/music/showall.json?token=252db1d77e53f52fd85c5b346fef7c90e345b3b3f0b12018a2074298e4b35182&region=jp2")).json();
    msgEl.innerText = "Acquiring song data done.";

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
    recordList.sort((a, b) => b.rating - a.rating);

    // Generate result
    const createTextDiv = (content = "") => {
        const div = document.createElement("div");
        div.style.textAlign = "left";
        div.style.margin = "0.1rem";
        div.innerText = content;
        return div;
    }

    const resultDiv = document.createElement("div");

    const best30Sum = recordList.slice(0, 30)
        .map((r) => r.rating)
        .reduce((acc, val) => acc + val);

    resultDiv.appendChild(createTextDiv(`Generated at: ${new Date().toLocaleDateString()}`));
    resultDiv.appendChild(createTextDiv(`Best 30 Average: ${(best30Sum / 30).toFixed(2)}`));
    resultDiv.appendChild(createTextDiv(`Maximum Achievable Rating: ${((best30Sum + recordList[0].rating * 10) / 40).toFixed(2)}`));

    const table = document.createElement("table");
    table.style.width = "100%";
    const createRow = (dataArr, isHeader = false) => {
        const row = document.createElement("tr");
        const tag = isHeader ? "th" : "td";
        const difficultyColor = {
            [Difficulty.ultima]: "#3cf",
            [Difficulty.master]: "#c7f",
            [Difficulty.expert]: "#e46",
            [Difficulty.advance]: "#e73",
            [Difficulty.basic]: "#1c3"
        }[dataArr.pop()]
        for (const data of dataArr) {
            const item = document.createElement(tag);
            if (data instanceof HTMLImageElement) item.appendChild(data);
            else item.innerText = data;
            item.style.padding = "0.5rem";
            row.appendChild(item);
        }
        if (dataArr[0] <= 40) {
            // row.style.backgroundColor = (dataArr[0] <= 30) ? "#666" : "#333" ;
            if (dataArr[0] <= 30) row.children.item(0).style.color = "#fc7";
            row.children.item(0).style.fontWeight = "bold";
        }
        row.children.item(1).style.color = difficultyColor;
        row.children.item(1).style.fontWeight = "bold";
        return row;
    }

    const headerRow = ["#", "Song Name", "Constant", "Score", "Rating", "Clear", "Difficulty"];
    table.appendChild(createRow(headerRow, true));

    for (const [i, r] of recordList.entries()) {
        const rowData = [i + 1, r.title, r.songConst.toFixed(1), r.score, r.rating.toFixed(2), r.clear, r.difficulty];
        table.appendChild(createRow(rowData));
    }
    resultDiv.appendChild(table);
    msgEl.style.display = "none";

    mainDiv.insertAdjacentElement("afterBegin", resultDiv);

    // generate button for download result as png
    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Donwload Full Result as PNG";
    downloadBtn.style.margin = "0.5rem";
    downloadBtn.onclick = async () => {
        const link = document.createElement("a");
        link.download = "result_full.png";
        link.href = (await html2canvas(resultDiv, {
            onclone: (d, e) => { e.style.color = "black"; }
        })).toDataURL()
        link.click();
    }
    mainDiv.insertAdjacentElement("afterBegin", downloadBtn);

    const downloadB30Btn = document.createElement("button");
    downloadB30Btn.innerText = "Donwload Best 40 Scores as PNG";
    downloadB30Btn.style.margin = "0.5rem";
    downloadB30Btn.onclick = async () => {
        const link = document.createElement("a");
        link.download = "result_b40.png";
        link.href = (await html2canvas(resultDiv, {
            onclone: (d, e) => {
                const trs = e.querySelector(":last-child").children;
                for (;trs.length > 41;) trs[41].remove();
                e.style.color = "black"
            }
        })).toDataURL()
        link.click();
    }
    mainDiv.insertAdjacentElement("afterBegin", downloadB30Btn);

    const titleDiv = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = "Chunithm (International) Score Viewer";
    const githubContact = document.createElement("a");
    githubContact.href = "https://github.com/kyroslee/chuni_intl_viewer";
    githubContact.target = "_blank";
    githubContact.rel = "noopener noreferrer";
    githubContact.innerText = "kyroslee/chuni_intl_viewer@GitHub";
    titleDiv.appendChild(h3);
    titleDiv.appendChild(githubContact);
    mainDiv.insertAdjacentElement("afterbegin", titleDiv);
};

if (window.chuniIntlViewer) {
    alert("[chuni-intl-viewer] Please refresh the page before another new fetch.");
} else {
    window.chuniIntlViewer = true;
    msgEl.style.fontSize = "1.5rem";
    msgEl.style.padding = "1rem";
    mainDiv.append(msgEl)
    Object.assign(mainDiv.style, {
        padding: "0.1rem",
        backgroundColor: "#223",
        color: "#eec",
        width: "fit-content",
        minWidth: "100%"
    });
    document.body.insertAdjacentElement("afterBegin", mainDiv);
    main();
}
