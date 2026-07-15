function updateTacticalAI() {
    const box = document.getElementById("tacticalAI");
    if (!box) return;

    if (typeof players === "undefined") {
        box.innerHTML = "아직 경기 데이터가 없습니다.";
        return;
    }

    const playerList = Object.values(players);

    if (playerList.length === 0) {
        box.innerHTML = "아직 경기 데이터가 없습니다.";
        return;
    }

    const teams = {
        A: createTeamStats(),
        B: createTeamStats()
    };

    playerList.forEach(player => {
        const team = String(player.team || "A").toUpperCase();
        const target = teams[team] || teams.A;

        target.pts += player.pts || 0;
        target.reb += player.reb || 0;
        target.ast += player.ast || 0;
        target.stl += player.stl || 0;
        target.blk += player.blk || 0;
        target.to += player.to || 0;
        target.fgm += player.fgm || 0;
        target.fga += player.fga || 0;
        target.threeM += player.threeM || 0;
        target.threeA += player.threeA || 0;
    });

    const aAnalysis = analyzeTeam("A", teams.A, teams.B);
    const bAnalysis = analyzeTeam("B", teams.B, teams.A);

    box.innerHTML = `
        <h3>🧠 AI 전술 분석</h3>

        ${renderTeamAdvice("🔵", "A팀", aAnalysis)}

        <hr>

        ${renderTeamAdvice("🔴", "B팀", bAnalysis)}
    `;
}

function createTeamStats() {
    return {
        pts: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0,
        fgm: 0,
        fga: 0,
        threeM: 0,
        threeA: 0
    };
}

function analyzeTeam(teamName, team, opponent) {
    const fg = team.fga
        ? Math.round((team.fgm / team.fga) * 100)
        : 0;

    const three = team.threeA
        ? Math.round((team.threeM / team.threeA) * 100)
        : 0;

    const opponentFG = opponent.fga
        ? Math.round((opponent.fgm / opponent.fga) * 100)
        : 0;

    let offense = "";
    let defense = "";
    let mainStrategy = "";
    let offenseStars = 3;
    let defenseStars = 3;

    if (three >= 40 && team.threeA >= 4) {
        offense = "🎯 외곽 슛 비중을 유지하고 스크린 후 3점 기회를 노리세요.";
        offenseStars = 5;
    } else if (team.ast >= 5) {
        offense = "🤝 패스 플레이가 좋습니다. 컷인과 킥아웃 패스를 계속 활용하세요.";
        offenseStars = 4;
    } else if (team.reb > opponent.reb) {
        offense = "💪 리바운드 우세를 활용해 세컨드 찬스 공격을 강화하세요.";
        offenseStars = 4;
    } else if (fg < 40) {
        offense = "🚀 무리한 슛을 줄이고 골밑 돌파와 쉬운 득점을 먼저 노리세요.";
        offenseStars = 5;
    } else {
        offense = "🏀 현재 공격 흐름을 유지하되 패스 횟수를 조금 더 늘리세요.";
    }

    if (opponentFG >= 55) {
        defense = "🛡 상대 슛 성공률이 높습니다. 지역방어와 빠른 로테이션을 추천합니다.";
        defenseStars = 5;
    } else if (opponent.pts >= team.pts + 6) {
        defense = "⚡ 상대 공격 흐름을 끊기 위해 전면 압박과 적극적인 스위치를 사용하세요.";
        defenseStars = 5;
    } else if (opponent.reb > team.reb) {
        defense = "💪 박스아웃을 강화하고 골밑 수비 위치를 먼저 잡으세요.";
        defenseStars = 4;
    } else if (team.stl + team.blk >= 5) {
        defense = "🔒 현재 수비 압박이 효과적입니다. 같은 강도를 유지하세요.";
        defenseStars = 4;
    } else {
        defense = "👥 도움수비 후 빠르게 자신의 수비수에게 복귀하세요.";
    }

    if (team.to >= 5) {
        mainStrategy = "턴오버를 줄이고 안전한 패스로 공격을 시작하세요.";
    } else if (three >= 40 && team.threeA >= 4) {
        mainStrategy = "빠른 패스 후 외곽 슛을 적극적으로 노리세요.";
    } else if (team.reb > opponent.reb) {
        mainStrategy = "골밑 장악력을 활용해 리바운드 이후 빠르게 공격하세요.";
    } else if (team.ast >= 5) {
        mainStrategy = "볼을 오래 소유하지 말고 패스와 컷인으로 수비를 흔드세요.";
    } else {
        mainStrategy = "쉬운 득점 기회를 만들고 수비에서는 첫 패스를 압박하세요.";
    }

    return {
        teamName,
        fg,
        three,
        offense,
        defense,
        mainStrategy,
        offenseStars,
        defenseStars
    };
}

function renderTeamAdvice(icon, teamLabel, analysis) {
    return `
        <div style="padding:12px 0;">
            <h3>${icon} ${teamLabel}</h3>

            <b>🏀 공격 전술</b><br>
            ${makeStars(analysis.offenseStars)}<br>
            ${analysis.offense}

            <br><br>

            <b>🛡 수비 전술</b><br>
            ${makeStars(analysis.defenseStars)}<br>
            ${analysis.defense}

            <br><br>

            <b>🔥 핵심 전략</b><br>
            ${analysis.mainStrategy}

            <br><br>

            <small>
                FG ${analysis.fg}% · 3P ${analysis.three}%
            </small>
        </div>
    `;
}

function makeStars(count) {
    return "⭐".repeat(count) + "☆".repeat(5 - count);
}