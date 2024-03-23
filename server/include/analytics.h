#include<vector>
#include<string>
#include<string.h>
#include<unordered_map>
#include <sstream>
#include <algorithm>
#include <fstream>
#include <unordered_set>
#include "compressGene.h"
#include "JSONresponsehandler.h"
struct ThreadData {
    std::string genome1;
    std::string genome2;
    std::unordered_map<std::string, int>* mp;
    double (*metric_function)(const std::string, const std::string);
};
bool KMP_search(std::string genome,std::string mutation);
bool is_valid_genome(std:: string genome);
std::string mutations_analysis(std::string genome);
std::unordered_map<std::string,int> KMer_analysis(std::string genome, int k);
std::string lcs(std::string genome1,std::string genome2);
std::string similarity_report(std::string genome1, std::string genome2);
std::string lcs_report(std::string genome1,std::string genome2);