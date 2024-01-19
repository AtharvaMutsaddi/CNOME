#include<vector>
#include<string>
#include<unordered_map>
#include <sstream>
#include <algorithm>
#include <fstream>


std::string KMP_analytics_response(std::unordered_map<std::string,bool> mp);
std::string inputfile_error_message();
std::vector<int> KMP_search(std::string genome,std::string mutation);
bool is_valid_genome(std:: string genome);
std::string mutations_analysis(std::string genome);