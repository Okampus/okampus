# If NEXT_PUBLIC_S3_LOCAL is true, then the S3 endpoint is http://localhost:19000

if [ "$NEXT_PUBLIC_S3_LOCAL" = true ]; then
  until nc -z -w5 localhost 19000; do
    echo "Waiting for MinIO to be up..."
    sleep 1
  done
fi

echo "Initing S3..."
node ./tools/scripts/s3/init.mjs
echo "Done initing S3"
