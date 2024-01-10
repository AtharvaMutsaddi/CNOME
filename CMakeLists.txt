cmake_minimum_required(VERSION 3.12)
project(test)

set(CMAKE_CXX_STANDARD 11)

add_executable(test test.cpp)

target_link_libraries(test PRIVATE pthread)