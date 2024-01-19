cmake_minimum_required(VERSION 3.12)
project(server)

file(GLOB SOURCE_FILES "src/*.cpp")
file(GLOB HEADER_FILES "include/*.h")

set(CMAKE_CXX_STANDARD 11)

add_executable(server ${SOURCE_FILES} ${HEADER_FILES})

target_include_directories(server PRIVATE include)
target_link_libraries(server PRIVATE pthread)
