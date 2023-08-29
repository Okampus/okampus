if [ $# -lt 1 ]; then
  echo 1>&2 "$0: not enough arguments"
  exit 2
fi

nx g hasura-feature actor --folder $1
nx g hasura-feature actor-image --subfolder actors --folder $1
nx g hasura-feature address --subfolder actors --folder $1 --tenant-scoped false
nx g hasura-feature bank-info --subfolder actors --folder $1
nx g hasura-feature follow --subfolder actors --folder $1
nx g hasura-feature legal-unit-location --subfolder actors --folder $1 --tenant-scoped false --expect-rels actor:name
nx g hasura-feature legal-unit --subfolder actors --folder $1 --tenant-scoped false --expect-rels actor:name
nx g hasura-feature location --subfolder actors --folder $1
nx g hasura-feature social --subfolder actors --folder $1
nx g hasura-feature tag --subfolder actors --folder $1

nx g hasura-feature event --folder $1 --expect-rels location,eventOrganizes
nx g hasura-feature event-favorite --subfolder events --folder $1
nx g hasura-feature event-join --subfolder events --folder $1 --settles='by:processedById_at:processedAt_if:props.state === enum!ApprovalState.Approved || props.state === enum!ApprovalState.Rejected;by:participationProcessedById_at:participationProcessedAt_if:props.isPresent !== null'
nx g hasura-feature event-organize --subfolder events --folder $1
nx g hasura-feature event-supervisor --subfolder events --folder $1

nx g hasura-feature team --folder $1
nx g hasura-feature action --subfolder teams --folder $1
nx g hasura-feature bank-account --subfolder teams --folder $1
nx g hasura-feature document --subfolder teams --folder $1
nx g hasura-feature expense --subfolder teams --folder $1
nx g hasura-feature expense-item --subfolder teams --folder $1
nx g hasura-feature finance --subfolder teams --folder $1
nx g hasura-feature grant --subfolder teams --folder $1
nx g hasura-feature grant-allocate --subfolder teams --folder $1
nx g hasura-feature mission --subfolder teams --folder $1
nx g hasura-feature mission-join --subfolder teams --folder $1 --settles='by:processedById_at:processedAt_if:props.state === enum!ApprovalState.Approved || props.state === enum!ApprovalState.Rejected;by:pointsProcessedById_at:pointsProcessedAt_if:props.points !== null'
nx g hasura-feature pole --subfolder teams --folder $1
nx g hasura-feature project --subfolder teams --folder $1
nx g hasura-feature role --subfolder teams --folder $1
nx g hasura-feature team-history --subfolder teams --folder $1
nx g hasura-feature team-join --subfolder teams --folder $1 --expect-rels submission --settles='by:processedById_at:processedAt_if:props.state === enum!ApprovalState.Rejected || (props.state === enum!ApprovalState.Approved && props.receivedRoleId)'
nx g hasura-feature team-member --subfolder teams --folder $1
nx g hasura-feature team-member-role --subfolder teams --folder $1

nx g hasura-feature tenant --folder $1 --tenant-scoped false
nx g hasura-feature campus --subfolder tenants --folder $1
nx g hasura-feature campus-cluster --subfolder tenants --folder $1
nx g hasura-feature event-approval --subfolder tenants --folder $1
nx g hasura-feature event-approval-step --subfolder tenants --folder $1
nx g hasura-feature tenant-organize --subfolder tenants --folder $1

nx g hasura-feature form --folder $1
nx g hasura-feature form-submission --subfolder forms --folder $1

nx g hasura-feature user --folder $1
nx g hasura-feature session --subolder users --folder $1
nx g hasura-feature shortcut --subolder users --folder $1
