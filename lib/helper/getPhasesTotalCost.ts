
type Phase = Pick<ExecutionPhase, "creditsConsumed">
const GetPhasesTotalCost = (phases: Phase[]) => {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0 )
}

export default GetPhasesTotalCost
