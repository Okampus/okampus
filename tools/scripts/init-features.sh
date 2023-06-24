if [ $# -lt 1 ]; then
  echo 1>&2 "$0: not enough arguments"
  exit 2
fi

nx g hasura-feature tag --folder $1
nx g hasura-feature actor --folder $1
nx g hasura-feature follow --subfolder actors --folder $1
nx g hasura-feature social --subfolder actors --folder $1
nx g hasura-feature actor-image --subfolder actors --folder $1
nx g hasura-feature event --folder $1 --expect-rels content --expect-ids teamId
nx g hasura-feature event-join --subfolder events --folder $1
nx g hasura-feature form --folder $1
nx g hasura-feature individual --folder $1
nx g hasura-feature user --subfolder individuals --folder $1
nx g hasura-feature bot --subfolder individuals --folder $1
nx g hasura-feature project --folder $1
nx g hasura-feature team --folder $1
nx g hasura-feature action --subfolder teams --folder $1
nx g hasura-feature finance --subfolder teams --folder $1
nx g hasura-feature team-join --subfolder teams --folder $1 --settles='by:settledById_at:settledAt_if:props.state === enum!ApprovalState.Rejected || (props.state === enum!ApprovalState.Approved && props.receivedRoleId)'
nx g hasura-feature mission-join --subfolder teams --folder $1 --settles='by:settledById_at:settledAt_if:props.state === enum!ApprovalState.Approved || props.state === enum!ApprovalState.Rejected;by:pointsSettledById_at:pointsSettledAt_if:props.points !== null'
nx g hasura-feature tenant --folder $1 --tenant-scoped false
nx g hasura-feature event-approval-step --subfolder tenants --folder $1
