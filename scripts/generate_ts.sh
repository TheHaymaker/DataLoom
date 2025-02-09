#!/bin/bash

TS_PROTO_PATH="./node_modules/.bin/ts-poto"
OUT_DIR="./ts_out"

mkdir -p $OUT_DIR

protoc \
  --plugin="proto=${TS_PROTO_PATH}" \
  --js_out="import_style=commonjs,binary:${OUT_DIR}" \
  --ts_out="service=grpc-web:${OUT_DIR}" \
  -I ./protos \
  protos/*.proto
