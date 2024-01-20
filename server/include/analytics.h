#include<vector>
#include<string>
#include<string.h>
#include<unordered_map>
#include <sstream>
#include <algorithm>
#include <fstream>
#include "compressGene.h"
#include "JSONresponsehandler.h"
std::vector<int> KMP_search(std::string genome,std::string mutation);
bool is_valid_genome(std:: string genome);
std::string mutations_analysis(std::string genome);
std::unordered_map<std::string,int> KMer_analysis(std::string genome, int k);