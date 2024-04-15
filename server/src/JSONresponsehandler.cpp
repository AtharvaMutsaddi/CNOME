#include "JSONresponsehandler.h"


std::string get_inputfile_error_message(){
  return "{\"error\":\"input genome file may be corrupted or in a file format not supported... please ensure gene sequence is a valid combination of A,C,T,G\"}";
}
std::string get_mapped_response_error_message(){
  return "{\"Error\":\"Cannot get mapped response for this analytics method\"}";
}
std::string get_mapped_analysis_response(std::unordered_map<std::string,int> mp){
  std::stringstream response;
  response<<"{";
  for(auto i: mp){
    response<<"\""<<i.first<<"\""<<":"<<i.second<<",";
  }
  std::string final_response=response.str();
  final_response[final_response.length()-1]='}';
  if(final_response.size()==1){
    return get_mapped_response_error_message();
  }
  return final_response;
}
