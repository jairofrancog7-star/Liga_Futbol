/* MatchOra: MIT. See LICENSE for copyright and terms. */
function emptyTally(teamId) {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    fairPlayPoints: 0,
    remaining: 0
  };
}
const FINISHED = /* @__PURE__ */ new Set(["finished"]);
function buildTallies(teamIds, fixtures, rules) {
  const tallies = /* @__PURE__ */ new Map();
  for (const id of teamIds) {
    tallies.set(id, emptyTally(id));
  }
  let anyUnfinished = false;
  for (const fx of fixtures) {
    const { homeTeamId, awayTeamId } = fx;
    if (!homeTeamId || !awayTeamId) {
      continue;
    }
    const home = tallies.get(homeTeamId);
    const away = tallies.get(awayTeamId);
    if (!home || !away) {
      continue;
    }
    const finished = FINISHED.has(fx.snapshot.status);
    const started = fx.snapshot.status !== "scheduled" && fx.snapshot.status !== "postponed";
    if (!finished) {
      anyUnfinished = true;
      home.remaining += 1;
      away.remaining += 1;
    }
    if (!started) {
      continue;
    }
    const { home: hg, away: ag } = fx.snapshot.score;
    home.goalsFor += hg;
    home.goalsAgainst += ag;
    away.goalsFor += ag;
    away.goalsAgainst += hg;
    home.fairPlayPoints += fx.snapshot.redCards.home * 3;
    away.fairPlayPoints += fx.snapshot.redCards.away * 3;
    home.played += 1;
    away.played += 1;
    if (hg > ag) {
      home.won += 1;
      away.lost += 1;
      home.points += rules.pointsWin;
      away.points += rules.pointsLoss;
    } else if (hg < ag) {
      away.won += 1;
      home.lost += 1;
      away.points += rules.pointsWin;
      home.points += rules.pointsLoss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += rules.pointsDraw;
      away.points += rules.pointsDraw;
    }
  }
  return { tallies, anyUnfinished };
}
function goalDiff(t) {
  return t.goalsFor - t.goalsAgainst;
}
function headToHead(tied, fixtures, rules) {
  const set = new Set(tied);
  const acc = /* @__PURE__ */ new Map();
  for (const id of tied) {
    acc.set(id, { points: 0, gd: 0 });
  }
  for (const fx of fixtures) {
    const { homeTeamId: h, awayTeamId: a } = fx;
    if (!h || !a || !set.has(h) || !set.has(a)) {
      continue;
    }
    if (!FINISHED.has(fx.snapshot.status)) {
      continue;
    }
    const { home: hg, away: ag } = fx.snapshot.score;
    const hh = acc.get(h);
    const aa = acc.get(a);
    hh.gd += hg - ag;
    aa.gd += ag - hg;
    if (hg > ag) {
      hh.points += rules.pointsWin;
      aa.points += rules.pointsLoss;
    } else if (hg < ag) {
      aa.points += rules.pointsWin;
      hh.points += rules.pointsLoss;
    } else {
      hh.points += rules.pointsDraw;
      aa.points += rules.pointsDraw;
    }
  }
  return acc;
}
function compareByTiebreaker(a, b, tb, fixtures, rules) {
  switch (tb) {
    case "points":
      return b.points - a.points;
    case "goal_difference":
      return goalDiff(b) - goalDiff(a);
    case "goals_for":
      return b.goalsFor - a.goalsFor;
    case "wins":
      return b.won - a.won;
    case "fair_play":
      return a.fairPlayPoints - b.fairPlayPoints;
    case "head_to_head_points": {
      const hh = headToHead([a.teamId, b.teamId], fixtures, rules);
      return (hh.get(b.teamId)?.points ?? 0) - (hh.get(a.teamId)?.points ?? 0);
    }
    case "head_to_head_goal_difference": {
      const hh = headToHead([a.teamId, b.teamId], fixtures, rules);
      return (hh.get(b.teamId)?.gd ?? 0) - (hh.get(a.teamId)?.gd ?? 0);
    }
    default:
      return 0;
  }
}
function sortTallies(tallies, fixtures, rules) {
  return [...tallies].sort((a, b) => {
    for (const tb of rules.tiebreakers) {
      const r = compareByTiebreaker(a, b, tb, fixtures, rules);
      if (r !== 0) {
        return r;
      }
    }
    return a.teamId < b.teamId ? -1 : a.teamId > b.teamId ? 1 : 0;
  });
}
function classifyQualification(sorted, rules, groupFinished) {
  const out = /* @__PURE__ */ new Map();
  const N = rules.advancePerGroup;
  if (groupFinished) {
    sorted.forEach((t, i) => {
      out.set(t.teamId, i < N ? "qualified" : "eliminated");
    });
    return out;
  }
  sorted.forEach((team, idx) => {
    const maxPoints = team.points + rules.pointsWin * team.remaining;
    const minPoints = team.points;
    const rivalsCouldMatchOrBeat = sorted.filter(
      (o) => o.teamId !== team.teamId && o.points + rules.pointsWin * o.remaining >= minPoints
    ).length;
    const rivalsCertainlyAhead = sorted.filter(
      (o) => o.teamId !== team.teamId && o.points > maxPoints
    ).length;
    let state;
    if (rivalsCouldMatchOrBeat < N) {
      state = "qualified";
    } else if (rivalsCertainlyAhead >= N) {
      state = "eliminated";
    } else if (idx < N) {
      state = "provisionally_qualified";
    } else {
      state = "still_possible";
    }
    out.set(team.teamId, state);
  });
  return out;
}
function computeGroupStanding(groupId, competitionId, teamIds, fixtures, rules) {
  const groupFixtures = fixtures.filter((f) => f.groupId === groupId);
  const { tallies, anyUnfinished } = buildTallies(teamIds, groupFixtures, rules);
  const sorted = sortTallies([...tallies.values()], groupFixtures, rules);
  const groupFinished = !anyUnfinished && groupFixtures.length > 0;
  const qualification = classifyQualification(sorted, rules, groupFinished);
  const rows = sorted.map((t, i) => ({
    teamId: t.teamId,
    rank: i + 1,
    played: t.played,
    won: t.won,
    drawn: t.drawn,
    lost: t.lost,
    goalsFor: t.goalsFor,
    goalsAgainst: t.goalsAgainst,
    goalDifference: goalDiff(t),
    points: t.points,
    fairPlayPoints: t.fairPlayPoints,
    qualification: qualification.get(t.teamId) ?? "unknown"
  }));
  return { groupId, competitionId, rows, provisional: anyUnfinished };
}
export {
  computeGroupStanding,
  sortTallies
};
