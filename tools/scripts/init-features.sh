if [ $# -lt 1 ]; then
  echo 1>&2 "$0: not enough arguments"
  exit 2
fi

nx g hasura-feature tag --folder $1
nx g hasura-feature actor --folder $1
nx g hasura-feature follow --subfolder actors --folder $1
nx g hasura-feature social --subfolder actors --folder $1
nx g hasura-feature actor-image --subfolder actors --folder $1
nx g hasura-feature event --folder $1
nx g hasura-feature event-join --subfolder events --folder $1
nx g hasura-feature form --folder $1
nx g hasura-feature individual --folder $1
nx g hasura-feature user --subfolder individuals --folder $1
nx g hasura-feature bot --subfolder individuals --folder $1
nx g hasura-feature project --folder $1
nx g hasura-feature team --folder $1
nx g hasura-feature action --subfolder teams --folder $1
nx g hasura-feature finance --subfolder teams --folder $1
nx g hasura-feature team-join --subfolder teams --folder $1
nx g hasura-feature tenant --folder $1
nx g hasura-feature event-approval-step --subfolder tenants --folder $1
