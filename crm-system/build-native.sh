#!/bin/bash

# CRM Synergy Native Image Build Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Maven is available
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven first."
        exit 1
    fi
}

# Check if GraalVM is available
check_graalvm() {
    if ! command -v native-image &> /dev/null; then
        print_warning "GraalVM native-image not found in PATH. Using Maven plugin..."
    fi
}

# Build native image using Maven
build_native() {
    print_status "Building native image with Maven..."
    mvn clean package -Pnative -DskipTests
    
    if [ $? -eq 0 ]; then
        print_success "Native image built successfully!"
        print_status "Executable location: target/crm-system-native"
        print_status "Size: $(du -h target/crm-system-native | cut -f1)"
    else
        print_error "Failed to build native image"
        exit 1
    fi
}

# Run the native executable
run_native() {
    if [ ! -f "target/crm-system-native" ]; then
        print_error "Native executable not found. Please build first."
        exit 1
    fi
    
    print_status "Starting native application..."
    ./target/crm-system-native
}

# Show usage information
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build native image using Maven (default)"
    echo "  run         Run the native executable"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build      # Build native image"
    echo "  $0 run        # Run native executable"
}

# Main script logic
case "${1:-build}" in
    build)
        check_maven
        check_graalvm
        build_native
        ;;
    run)
        run_native
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac