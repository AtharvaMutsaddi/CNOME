#include<string>
#include<unordered_map>
#include<sstream>


std::string get_inputfile_error_message();
std::string get_mapped_response_error_message();
std::string get_mapped_analysis_response(std::unordered_map<std::string,int> mp);
std::string lcs_response(std::string lcs);