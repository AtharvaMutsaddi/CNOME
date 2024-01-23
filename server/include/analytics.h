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
bool KMP_search(std::string genome,std::string mutation);
bool is_valid_genome(std:: string genome);
std::string mutations_analysis(std::string genome);
std::unordered_map<std::string,int> KMer_analysis(std::string genome, int k);
double levenshtein_dist(std::string genome1,std::string genome2);
double jaccard_index(std::string genome1,std::string genome2);
double sequence_identity(std::string genome1,std::string genome2);