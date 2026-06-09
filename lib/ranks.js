export function getRank(points) {
  if (points >= 500) return { label: "Beast Mode", emoji: "🥇", color: "text-yellow-400" }
  if (points >= 300) return { label: "On Fire", emoji: "🔥", color: "text-orange-400" }
  if (points >= 150) return { label: "Grinder", emoji: "💪", color: "text-blue-400" }
  if (points >= 50)  return { label: "Casual", emoji: "😐", color: "text-gray-400" }
  if (points >= 0)   return { label: "Couch Potato", emoji: "🦥", color: "text-green-300" }
  return { label: "Shame Zone", emoji: "🐸", color: "text-red-400" }
}

export function getPointsForAction(action) {
  const points = {
    LOG_WORKOUT: 10,
    SEVEN_DAY_STREAK: 25,
    HIT_WEEKLY_GOAL: 15,
    FIRST_TO_LOG: 5,
    MISS_DAY: -15,
    GET_STRIKE: -25,
    THREE_STRIKES: -50,
  }
  return points[action] || 0
}