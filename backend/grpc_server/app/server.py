import grpc
from concurrent import futures
import os, sys
# ensure generated protobuf modules can be imported (library_pb2, etc.)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'generated')))
from app.service_impl import LibraryServiceImpl
import generated.library_pb2_grpc as library_pb2_grpc

def serve():
    port = os.getenv("GRPC_PORT", "50051")
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    library_pb2_grpc.add_LibraryServiceServicer_to_server(LibraryServiceImpl(), server)
    server.add_insecure_port(f"[::]:{port}")
    server.start()
    print(f"gRPC Server running on port {port}")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()
