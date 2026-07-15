function printGameReport() {
    if (typeof players === "undefined" || Object.keys(players).length === 0) {
        alert("먼저 경기 기록을 입력해 주세요.");
        return;
    }

    const reportWindow = window.open("", "_blank");

    if (!reportWindow) {
        alert("팝업이 차단되었습니다. Safari 팝업 허용을 확인해 주세요.");
        return;
    }

    const date = new Date().toLocaleString("ko-KR");

    const playerRows = Object.entries(players)
        .map(([name, p]) => {
            const fg = p.fga
                ? Math.round((p.fgm / p.fga) * 100)
                : 0;

            return `
                <tr>
                    <td>${escapeReportHTML(name)}</td>
                    <td>${escapeReportHTML(p.team || "-")}</td>
                    <td>${p.pts || 0}</td>
                    <td>${p.reb || 0}</td>
                    <td>${p.ast || 0}</td>
                    <td>${p.stl || 0}</td>
                    <td>${p.blk || 0}</td>
                    <td>${p.to || 0}</td>
                    <td>${fg}%</td>
                </tr>
            `;
        })
        .join("");

    const sections = [
        getReportSection("report2", "경기 리포트"),
        getReportSection("mvpCard", "경기 MVP"),
        getReportSection("bestLineup", "AI 베스트 라인업"),
        getReportSection("hotPlayer", "HOT PLAYER"),
        getReportSection("winPrediction", "AI 승률 예측"),
        getReportSection("coachAI", "AI 감독 코멘트"),
        getReportSection("teamCompare", "팀 비교"),
        getReportSection("leaderboard", "선수 랭킹"),
        getReportSection("growthText", "성장 분석")
    ].join("");

    const growthImage = getCanvasImage("growthChart");
    const shotImage = getCanvasImage("court");
    const scoreImage = getCanvasImage("scoreChart");

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ScoutVision 경기 리포트</title>

            <style>
                body {
                    margin: 0;
                    padding: 30px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    background: #ffffff;
                    color: #111827;
                }

                h1, h2, h3 {
                    margin-top: 0;
                }

                .header {
                    padding-bottom: 20px;
                    margin-bottom: 24px;
                    border-bottom: 3px solid #111827;
                }

                .section {
                    margin-bottom: 22px;
                    padding: 18px;
                    border: 1px solid #d1d5db;
                    border-radius: 12px;
                    page-break-inside: avoid;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 12px;
                    font-size: 13px;
                }

                th, td {
                    padding: 8px;
                    border: 1px solid #cbd5e1;
                    text-align: center;
                }

                th {
                    background: #e5e7eb;
                }

                img {
                    display: block;
                    max-width: 100%;
                    margin-top: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                }

                button {
                    padding: 12px 18px;
                    border: 0;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .print-area {
                    margin-bottom: 20px;
                }

                @media print {
                    body {
                        padding: 0;
                    }

                    .print-area {
                        display: none;
                    }

                    .section {
                        break-inside: avoid;
                    }
                }
            </style>
        </head>

        <body>
            <div class="print-area">
                <button onclick="window.print()">📄 PDF로 저장 / 인쇄</button>
            </div>

            <div class="header">
                <h1>🏀 ScoutVision 경기 분석 리포트</h1>
                <p>생성 시각: ${date}</p>
            </div>

            <div class="section">
                <h2>📊 선수 기록</h2>

                <table>
                    <thead>
                        <tr>
                            <th>선수</th>
                            <th>팀</th>
                            <th>득점</th>
                            <th>리바운드</th>
                            <th>어시스트</th>
                            <th>스틸</th>
                            <th>블록</th>
                            <th>턴오버</th>
                            <th>FG</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${playerRows}
                    </tbody>
                </table>
            </div>

            ${sections}

            ${
                scoreImage
                    ? `
                    <div class="section">
                        <h2>📈 득점 흐름</h2>
                        <img src="${scoreImage}" alt="득점 흐름">
                    </div>
                    `
                    : ""
            }

            ${
                growthImage
                    ? `
                    <div class="section">
                        <h2>📈 성장 그래프</h2>
                        <img src="${growthImage}" alt="성장 그래프">
                    </div>
                    `
                    : ""
            }

            ${
                shotImage
                    ? `
                    <div class="section">
                        <h2>🎯 슛차트</h2>
                        <img src="${shotImage}" alt="슛차트">
                    </div>
                    `
                    : ""
            }

            <script>
                setTimeout(function () {
                    window.print();
                }, 500);
            <\/script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

function getReportSection(id, title) {
    const element = document.getElementById(id);

    if (!element) return "";

    const content = element.innerHTML.trim();

    if (!content) return "";

    return `
        <div class="section">
            <h2>${title}</h2>
            ${content}
        </div>
    `;
}

function getCanvasImage(id) {
    const canvas = document.getElementById(id);

    if (!canvas || typeof canvas.toDataURL !== "function") {
        return "";
    }

    try {
        return canvas.toDataURL("image/png");
    } catch (error) {
        return "";
    }
}

function escapeReportHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}