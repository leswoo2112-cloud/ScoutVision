function updateLeagueStandings() {
    const box = document.getElementById("leagueStandings");
    if (!box) return;

    if (typeof players === "undefined") {
        box.innerHTML = "아직 리그 기록이 없습니다.";
        return;
    }

    const teamStats = {};

    Object.values(players).forEach(player => {
        const team = String(player.team || "A").toUpperCase();

        if (!teamStats[team]) {
            teamStats[team] = {
                team,
                pts: 0,
                reb: 0,
                ast: 0,
                stl: 0,
                blk: 0,
                to: 0
            };
        }

        teamStats[team].pts += player.pts || 0;
        teamStats[team].reb += player.reb || 0;
        teamStats[team].ast += player.ast || 0;
        teamStats[team].stl += player.stl || 0;
        teamStats[team].blk += player.blk || 0;
        teamStats[team].to += player.to || 0;
    });

    const teams = Object.values(teamStats);

    if (teams.length === 0) {
        box.innerHTML = "아직 리그 기록이 없습니다.";
        return;
    }

    const aScore = teamStats.A ? teamStats.A.pts : 0;
    const bScore = teamStats.B ? teamStats.B.pts : 0;

    teams.forEach(team => {
        const opponentScore =
            team.team === "A"
                ? bScore
                : aScore;

        team.games = 1;
        team.win = team.pts > opponentScore ? 1 : 0;
        team.draw = team.pts === opponentScore ? 1 : 0;
        team.loss = team.pts < opponentScore ? 1 : 0;
        team.allowed = opponentScore;
        team.diff = team.pts - opponentScore;

        team.winRate =
            team.games > 0
                ? Math.round((team.win / team.games) * 100)
                : 0;
    });

    teams.sort((a, b) => {
        if (b.winRate !== a.winRate) {
            return b.winRate - a.winRate;
        }

        if (b.diff !== a.diff) {
            return b.diff - a.diff;
        }

        return b.pts - a.pts;
    });

    let html = `
        <h3>🏆 리그 순위표</h3>

        <div style="overflow-x:auto;">
            <table style="
                width:100%;
                border-collapse:collapse;
                text-align:center;
                min-width:700px;
            ">
                <thead>
                    <tr>
                        <th style="padding:10px;border-bottom:1px solid #475569;">순위</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">팀</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">경기</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">승</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">무</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">패</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">승률</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">득점</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">실점</th>
                        <th style="padding:10px;border-bottom:1px solid #475569;">득실차</th>
                    </tr>
                </thead>

                <tbody>
    `;

    teams.forEach((team, index) => {
        const medal =
            index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `${index + 1}`;

        const teamIcon =
            team.team === "A"
                ? "🔵"
                : team.team === "B"
                ? "🔴"
                : "⚪";

        const diffText =
            team.diff > 0
                ? `+${team.diff}`
                : `${team.diff}`;

        html += `
            <tr>
                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${medal}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${teamIcon} ${team.team}팀
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.games}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.win}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.draw}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.loss}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.winRate}%
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.pts}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${team.allowed}
                </td>

                <td style="padding:10px;border-bottom:1px solid #334155;">
                    ${diffText}
                </td>
            </tr>
        `;
    });

    const first = teams[0];

    html += `
                </tbody>
            </table>
        </div>

        <br>

        <div style="
            padding:12px;
            border-top:1px solid #475569;
        ">
            🤖 현재 선두는
            <b>${first.team}팀</b>이며,
            득실차는
            <b>${first.diff > 0 ? "+" : ""}${first.diff}</b>입니다.
        </div>
    `;

    box.innerHTML = html;
}