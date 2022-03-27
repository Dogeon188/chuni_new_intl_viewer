import html2canvas from "html2canvas"

const Difficulty = {
    ultima: "ULT",
    master: "MAS",
    expert: "EXP",
    advance: "ADV",
    basic: "BAS"
}

const mainDiv = $("<div>")
const msgEl = $("<div>")

const strToNum = (str) => Number([...str].filter(e => e !== ",").join(""))

const getCookie = (key) => {
    const cookieEntry = document.cookie
        .split(";")
        .map(e => decodeURIComponent(e.trim()))
        .map(e => e.split("="))
        .find(e => e[0] === key)
    if (cookieEntry) return cookieEntry[1] // value
    return ""
}

const getSongList = async (difficulty = Difficulty.master) => {
    const fd = new FormData()
    fd.append("genre", 99)
    fd.append("token", getCookie("_t"))
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
    })
    const htmlStr = await res.text()
    const formList = [...($("<div>").html(htmlStr).find("form"))]
    formList.shift()
    return formList
}

const ratingCalc = (score, chartConst) => {
    chartConst *= 100
    const points = [
        [1010000, chartConst + 215],
        [1009000, chartConst + 215],
        [1007500, chartConst + 200],
        [1005000, chartConst + 150],
        [1000000, chartConst + 100],
        [975000, chartConst],
        [925000, chartConst - 300],
        [900000, chartConst - 500],
        [800000, (chartConst - 500) / 2],
        [500000, 0]
    ]
    let p
    points.some((v, i) => (p = i, score > v[0]))
    const prev = points[p-1], cur = points[p]
    const ret = cur[1] + (prev[1] - cur[1]) / (prev[0] - cur[0]) * (score - cur[0])
    return Math.floor(ret + Number.EPSILON) / 100
}

const recordFetch = async () => {
    const ret = []

    for (const difficulty of Object.values(Difficulty)) {
        msgEl.text(`Fetching play record (${difficulty})...`)
        const songList = await getSongList(difficulty)

        for (const songDataForm of songList) {
            const songData = $(songDataForm)
            const title = songData.find(".music_title").text()
            const scoreStr = songData.find(".text_b").length ? songData.find(".text_b").text() : null
            const icons = songData.find(".play_musicdata_icon")
            let clear = null
            if (icons.length) {
                for (const clearType of ["fullchain", "fullchain2", "alljustice", "fullcombo"]) {
                    clear = icons.find(`img[src*="${clearType}"]`)
                    if (clear.length) break
                }
            }
            if (title && scoreStr) {
                ret.push({
                    title,
                    score: strToNum(scoreStr),
                    difficulty,
                    clear
                })
            }
        }
    }
    msgEl.text("Play record fetch done.")
    return ret
}

const main = async () => {
    if (window.location.hostname !== "chunithm-net-eng.com") {
        alert("[chuni_intl_viewer] This tools could only be used under chunithm-net international.")
        window.location.href = "https://chunithm-net-eng.com/"
        return
    }

    if (!getCookie("_t")) {
        alert("[chuni-intl-viewer] Token not found. Please login first.")
        window.location.href = "https://chunithm-net-eng.com/"
        return
    }

    const recordList = await recordFetch()
    
    msgEl.text("Acquiring song data...")
    // const musicData = await (await fetch("http://localhost:3000/songData.json")).json()
    const musicData = await (await fetch("https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/songData.json")).json()
    msgEl.text("Acquiring song data done.")

    // do rating calc for record list
    recordList.map(r => {
        const songInfo = musicData[r.title]
        if (songInfo === undefined) {
            alert(`[chuni-intl-viewer] Found unknown song "${r.title} ${r.difficulty}", please inform the author to update song data.`)
            r.songConst = 0
            r.rating = 0
            return
        }
        r.songConst = songInfo[r.difficulty]
        r.rating = ratingCalc(r.score, r.songConst)
    })
    recordList.sort((a, b) => b.rating - a.rating || b.songConst - a.songConst)
    // Generate result
    const createTextDiv = (content = "") => $("<div>").text(content).css({
        textAlign: "left",
        margin: "0.5rem"
    })

    const best30Sum = recordList.slice(0, 30)
        .map(r => r.rating)
        .reduce((acc, val) => acc + val)

    const resultDiv = $("<div>").append(
        createTextDiv(`Generated at: ${new Date().toLocaleDateString()}`),
        createTextDiv(`Best 30 Average: ${(best30Sum / 30).toFixed(2)}`),
        createTextDiv(`Maximum Achievable Rating: ${((best30Sum + recordList[0].rating * 10) / 40).toFixed(2)}`)
    )

    const table = $("<table>").css("width", "100%")
    const createRow = (dataArr, isHeader = false) => {
        const row = $("<tr>")
        const tag = isHeader ? "<th>" : "<td>"
        const difficultyColor = {
            [Difficulty.ultima]: "#3cf",
            [Difficulty.master]: "#e9f",
            [Difficulty.expert]: "#e46",
            [Difficulty.advance]: "#e73",
            [Difficulty.basic]: "#1c3"
        }[dataArr.pop()]
        for (const data of dataArr) {
            const item = $(tag)
            if (data instanceof $) item.append(data[0])
            else item.text(data)
            item.css("padding", "0.5rem")
            row.append(item)
        }
        if (dataArr[0] <= 30) row.children().first().css("color", "#fc4")
        if (dataArr[0] <= 40) row.children().first().css("fontWeight", "bold")
        row.children().eq(1).css({
            color: difficultyColor,
            fontWeight: "bold"
        })
        return row
    }

    const headerRow = ["#", "Song Name", "Constant", "Score", "Rating", "FC/AJ", "Difficulty"]
    table.append(createRow(headerRow, true))

    for (const [i, r] of recordList.entries()) {
        table.append(createRow([
            i + 1,
            r.title,
            r.songConst ? r.songConst.toFixed(1) : "??.?",
            r.score,
            r.rating ? r.rating.toFixed(2) : "??.??",
            r.clear,
            r.difficulty
        ]))
    }
    table.children(":odd").css("backgroundColor", "#324")
    resultDiv.append(table)
    msgEl.hide()

    mainDiv.prepend(
        $("<button>")
            .text("Best 30")
            .click(async () => {
                (await html2canvas(resultDiv[0], {
                    backgroundColor: "#223",
                    onclone: (d, e) => {
                        e.style.width = "fit-content"
                        const trs = e.querySelector(":last-child").children
                        while (trs.length > 31) trs[31].remove()
                    }
                })).toBlob(b => {
                    if (b === null) return alert("[chuni-intl-viewer] Something went wrong when converting your scores to PNG. Please ask the author to fix it.")
                    const f = new File([b], "result_b30.png", {type: "image/png"})
                    if (navigator.canShare && navigator.canShare({files: [f]})) {
                        navigator.share({files: [f]}).catch(console.log)
                    }
                })
                
                
                // $("<a>").attr({
                //     href: (await html2canvas(resultDiv[0], {
                //         backgroundColor: "#223",
                //         onclone: (d, e) => {
                //             e.style.width = "fit-content"
                //             const trs = e.querySelector(":last-child").children
                //             while (trs.length > 31) trs[31].remove()
                //         }
                //     })).toDataURL()
                // })[0].click()
            }),
        $("<button>")
            .text("Best 40")
            .click(async () => {
                $("<a>").attr({
                    download: "result_b40.png",
                    href: (await html2canvas(resultDiv[0], {
                        backgroundColor: "#223",
                        onclone: (d, e) => {
                            e.style.width = "fit-content"
                            const trs = e.querySelector(":last-child").children
                            while (trs.length > 41) trs[41].remove()
                        }
                    })).toDataURL()
                })[0].click()
            }),
        $("<button>")
            .text("Full Result")
            .click(async () => {
                $("<a>").attr({
                    download: "result_full.png",
                    href: (await html2canvas(resultDiv[0], {
                        backgroundColor: "#223",
                        onclone: (d, e) => {e.style.width = "fit-content"}
                    })).toDataURL()
                })[0].click()
            }),
        resultDiv
    )
    mainDiv.find("button").css({
        margin: "0.5rem",
        fontFamily: "inherit",
        fontWeight: "bold",
        backgroundColor: "#324",
        border: "#536 3px solid",
        color: "#ccb",
        borderRadius: "3px",
        cursor: "pointer"
    }).prepend($("<i>").css({
        backgroundImage: "url(https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/assets/dl.png)",
        display: "inline-block",
        width: "1em",
        height: "1em",
        backgroundPosition: "0 0",
        backgroundSize: "cover"
    }))

    const titleDiv = $("<div>")
    const h3 = $("<h3>").text("Chunithm (International) Score Viewer")
    const githubContact = $("<a>").attr({
        href: "https://github.com/Dogeon188/chuni_new_intl_viewer",
        target: "_blank",
        rel: "noopener noreferrer"
    }).text("Dogeon188/chuni_new_intl_viewer@GitHub")
    titleDiv.append(h3, githubContact)
    mainDiv.prepend(titleDiv)
}

if (window.chuniIntlViewer) {
    alert("[chuni-intl-viewer] Please refresh the page before another new fetch.")
} else {
    window.chuniIntlViewer = true
    msgEl.css({
        fontSize: "1.5rem",
        padding: "1rem"
    })
    mainDiv.append(msgEl).css({
        padding: "0.1rem",
        backgroundColor: "#223",
        color: "#eec",
        width: "fit-content",
        minWidth: "100%"
    })
    $(document.body).prepend(mainDiv)
    try {
        main()
    } catch (error) {
        msgEl.text("An error occured! Please contact the author and report the bug report below. Your response would make Chunithm Viewer better!\n" + error)
    }
}

