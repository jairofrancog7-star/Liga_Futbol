/* Campos: MIT, Copyright (c) 2026 withqwerty. See LICENSE. */
import { PITCH, GOAL } from "./constants.js";
const HW = PITCH.width / 2;
const boxLeft = (PITCH.width - PITCH.penaltyAreaWidth) / 2;
const sixLeft = (PITCH.width - PITCH.goalAreaWidth) / 2;
const goalLeft = (PITCH.width - GOAL.width) / 2;
const arcDy = PITCH.penaltyAreaLength - PITCH.penaltySpotDistance;
function verticalMarkings(crop) {
  const m = [];
  m.push({
    id: "boundary",
    type: "rect",
    x: 0,
    y: 0,
    width: PITCH.width,
    height: PITCH.length
  });
  m.push({
    id: "pa-top",
    type: "rect",
    x: boxLeft,
    y: 0,
    width: PITCH.penaltyAreaWidth,
    height: PITCH.penaltyAreaLength
  });
  m.push({
    id: "6yd-top",
    type: "rect",
    x: sixLeft,
    y: 0,
    width: PITCH.goalAreaWidth,
    height: PITCH.goalAreaLength
  });
  m.push({
    id: "goal-top",
    type: "line",
    x: goalLeft,
    y: 0,
    x2: goalLeft + GOAL.width,
    y2: 0,
    thick: true
  });
  m.push({
    id: "pen-spot-top",
    type: "circle",
    cx: HW,
    cy: PITCH.penaltySpotDistance,
    r: 0.3,
    filled: true
  });
  {
    const asinAngle = Math.asin(arcDy / PITCH.penaltyArcRadius);
    m.push({
      id: "pen-arc-top",
      type: "arc",
      cx: HW,
      cy: PITCH.penaltySpotDistance,
      r: PITCH.penaltyArcRadius,
      startAngle: asinAngle,
      endAngle: Math.PI - asinAngle
    });
  }
  if (crop === "full") {
    m.push({
      id: "pa-bottom",
      type: "rect",
      x: boxLeft,
      y: PITCH.length - PITCH.penaltyAreaLength,
      width: PITCH.penaltyAreaWidth,
      height: PITCH.penaltyAreaLength
    });
    m.push({
      id: "6yd-bottom",
      type: "rect",
      x: sixLeft,
      y: PITCH.length - PITCH.goalAreaLength,
      width: PITCH.goalAreaWidth,
      height: PITCH.goalAreaLength
    });
    m.push({
      id: "goal-bottom",
      type: "line",
      x: goalLeft,
      y: PITCH.length,
      x2: goalLeft + GOAL.width,
      y2: PITCH.length,
      thick: true
    });
    m.push({
      id: "pen-spot-bottom",
      type: "circle",
      cx: HW,
      cy: PITCH.length - PITCH.penaltySpotDistance,
      r: 0.3,
      filled: true
    });
    {
      const asinAngle = Math.asin(arcDy / PITCH.penaltyArcRadius);
      m.push({
        id: "pen-arc-bottom",
        type: "arc",
        cx: HW,
        cy: PITCH.length - PITCH.penaltySpotDistance,
        r: PITCH.penaltyArcRadius,
        startAngle: Math.PI + asinAngle,
        endAngle: 2 * Math.PI - asinAngle
      });
    }
    m.push({
      id: "halfway",
      type: "line",
      x: 0,
      y: PITCH.length / 2,
      x2: PITCH.width,
      y2: PITCH.length / 2
    });
    m.push({
      id: "center-circle",
      type: "circle",
      cx: HW,
      cy: PITCH.length / 2,
      r: PITCH.centerCircleRadius
    });
    m.push({
      id: "center-spot",
      type: "circle",
      cx: HW,
      cy: PITCH.length / 2,
      r: 0.3,
      filled: true
    });
    m.push({
      id: "corner-tl",
      type: "arc",
      cx: 0,
      cy: 0,
      r: PITCH.cornerArcRadius,
      startAngle: 0,
      endAngle: Math.PI / 2
    });
    m.push({
      id: "corner-tr",
      type: "arc",
      cx: PITCH.width,
      cy: 0,
      r: PITCH.cornerArcRadius,
      startAngle: Math.PI / 2,
      endAngle: Math.PI
    });
    m.push({
      id: "corner-bl",
      type: "arc",
      cx: 0,
      cy: PITCH.length,
      r: PITCH.cornerArcRadius,
      startAngle: 3 * Math.PI / 2,
      endAngle: 2 * Math.PI
    });
    m.push({
      id: "corner-br",
      type: "arc",
      cx: PITCH.width,
      cy: PITCH.length,
      r: PITCH.cornerArcRadius,
      startAngle: Math.PI,
      endAngle: 3 * Math.PI / 2
    });
  }
  if (crop === "half") {
    m.push({
      id: "halfway",
      type: "line",
      x: 0,
      y: PITCH.length / 2,
      x2: PITCH.width,
      y2: PITCH.length / 2
    });
    m.push({
      id: "center-spot",
      type: "circle",
      cx: HW,
      cy: PITCH.length / 2,
      r: 0.3,
      filled: true
    });
    m.push({
      id: "center-arc",
      type: "arc",
      cx: HW,
      cy: PITCH.length / 2,
      r: PITCH.centerCircleRadius,
      startAngle: Math.PI,
      endAngle: 2 * Math.PI
    });
    m.push({
      id: "corner-tl",
      type: "arc",
      cx: 0,
      cy: 0,
      r: PITCH.cornerArcRadius,
      startAngle: 0,
      endAngle: Math.PI / 2
    });
    m.push({
      id: "corner-tr",
      type: "arc",
      cx: PITCH.width,
      cy: 0,
      r: PITCH.cornerArcRadius,
      startAngle: Math.PI / 2,
      endAngle: Math.PI
    });
  }
  return m;
}
function toHorizontal(m) {
  switch (m.type) {
    case "rect":
      return {
        ...m,
        x: m.y ?? 0,
        y: m.x ?? 0,
        width: m.height ?? 0,
        height: m.width ?? 0
      };
    case "line":
      return { ...m, x: m.y ?? 0, y: m.x ?? 0, x2: m.y2 ?? 0, y2: m.x2 ?? 0 };
    case "circle":
      return { ...m, cx: m.cy ?? 0, cy: m.cx ?? 0 };
    case "arc":
      return {
        ...m,
        cx: m.cy ?? 0,
        cy: m.cx ?? 0,
        startAngle: Math.PI / 2 - (m.endAngle ?? 0),
        endAngle: Math.PI / 2 - (m.startAngle ?? 0)
      };
    default:
      return m;
  }
}
function swapEndId(id) {
  if (id.includes("-top")) return id.replace("-top", "-bottom");
  if (id.includes("-bottom")) return id.replace("-bottom", "-top");
  if (id === "corner-tl") return "corner-bl";
  if (id === "corner-tr") return "corner-br";
  if (id === "corner-bl") return "corner-tl";
  if (id === "corner-br") return "corner-tr";
  return id;
}
function mirrorVertical(m) {
  switch (m.type) {
    case "rect":
      return {
        ...m,
        id: swapEndId(m.id),
        y: PITCH.length - (m.y ?? 0) - (m.height ?? 0)
      };
    case "line":
      return {
        ...m,
        id: swapEndId(m.id),
        y: PITCH.length - (m.y ?? 0),
        y2: PITCH.length - (m.y2 ?? 0)
      };
    case "circle":
      return {
        ...m,
        id: swapEndId(m.id),
        cy: PITCH.length - (m.cy ?? 0)
      };
    case "arc": {
      const start = m.startAngle ?? 0;
      const end = m.endAngle ?? 0;
      return {
        ...m,
        id: swapEndId(m.id),
        cy: PITCH.length - (m.cy ?? 0),
        startAngle: 2 * Math.PI - end,
        endAngle: 2 * Math.PI - start
      };
    }
    default:
      return { ...m, id: swapEndId(m.id) };
  }
}
function computePitchMarkings(crop, orientation = "vertical", side = "attack") {
  const shouldMirrorVertical = crop !== "full" && (orientation === "vertical" ? side === "defend" : side === "attack");
  const marks = crop === "full" ? verticalMarkings(crop) : shouldMirrorVertical ? verticalMarkings(crop).map(mirrorVertical) : verticalMarkings(crop);
  if (orientation === "horizontal") {
    return marks.map(toHorizontal);
  }
  return marks;
}
export {
  computePitchMarkings
};
