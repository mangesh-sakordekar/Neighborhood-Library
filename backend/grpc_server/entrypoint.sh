#!/bin/bash
python -m grpc_tools.protoc -I protos --python_out=generated --grpc_python_out=generated protos/library.proto
python app/server.py
