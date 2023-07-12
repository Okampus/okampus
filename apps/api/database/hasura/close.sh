if [ "$(docker ps -a -q -f name=okampus-hasura)" ]; then
    # close container if it is running
    echo "Closing okampus-hasura..." && docker stop okampus-hasura -t 2 | 2>/dev/null && docker wait okampus-hasura | 2>/dev/null && docker rm okampus-hasura && echo "Closed okampus-hasura."
fi


if [ "$(docker ps -aq -f status=exited -f name=okampus-hasura)" ]; then
    # cleanup container if not running
    echo "Cleaning up okampus-hasura..." && docker rm okampus-hasura
fi