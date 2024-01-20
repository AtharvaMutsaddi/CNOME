#include "compressGene.h"

std::string base64_encode(const unsigned char* data, size_t len) {
    const char base64Chars[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    std::string result;
    for (size_t i = 0; i < len; i += 3) {
        unsigned char octet1 = data[i];
        unsigned char octet2 = (i + 1 < len) ? data[i + 1] : 0;
        unsigned char octet3 = (i + 2 < len) ? data[i + 2] : 0;

        result.push_back(base64Chars[octet1 >> 2]);
        result.push_back(base64Chars[((octet1 & 0x03) << 4) | (octet2 >> 4)]);
        result.push_back((i + 1 < len) ? base64Chars[((octet2 & 0x0F) << 2) | (octet3 >> 6)] : '=');
        result.push_back((i + 2 < len) ? base64Chars[octet3 & 0x3F] : '=');
    }
    return result;
}
std::string compressAndEncodeBase64(const std::string& input) {
    z_stream zs;
    memset(&zs, 0, sizeof(zs));
    if (deflateInit(&zs, Z_BEST_COMPRESSION) != Z_OK) {
        return "Error initializing zlib compression";
    }
    zs.next_in = (Bytef*)input.data();
    zs.avail_in = input.size();
    int ret;
    char outbuffer[32768];
    std::string compressedString;

    do {
        zs.next_out = reinterpret_cast<Bytef*>(outbuffer);
        zs.avail_out = sizeof(outbuffer);

        ret = deflate(&zs, Z_FINISH);

        if (compressedString.size() < zs.total_out) {
            compressedString.append(outbuffer, zs.total_out - compressedString.size());
        }
    } while (ret == Z_OK);

    deflateEnd(&zs);

    if (ret != Z_STREAM_END) {
        return "Error compressing string with zlib";
    }
    std::string base64Encoded = base64_encode((const unsigned char*)compressedString.c_str(), compressedString.length());
    return base64Encoded;
}