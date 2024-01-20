#include <iostream>
#include <zlib.h>
#include <vector>
#include <cstring>

std::string base64_encode(const unsigned char* data, size_t len);
std::string compressAndEncodeBase64(const std::string& input); 