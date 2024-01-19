#include "analytics.h" 

const char* mutations[5]={
  "./mutations/cancer.txt",
  "./mutations/cysticfibrosis.txt",
  "./mutations/hemophilia.txt",
  "./mutations/huntington.txt",
  "./mutations/nf1.txt"
};
std::vector<int> KMP_search(std::string genome,std::string mutation){
  std::vector<int> ans;
  long long int n=genome.length();
  long long int k=mutation.length();
  if(n<k){
    return ans;
  }
  for(long long int i=0;i<n;i++){
    if(genome[i]==mutation[0]){
      std::string s=genome.substr(i,k);
      if(s==mutation){
        ans.push_back(i);
      }
    }
  }
  return ans;
}
bool is_valid_genome(std:: string genome){
  for(char c: genome){
    if(c!='A' && c!='T' && c!='G' && c!='C'){
      return false;
    }
  }
  return true;
}
std::string inputfile_error_message(){
  return "{\"message\":\"input genome file may be corrupted or in a file format not supported... please ensure gene sequence is a valid combination of A,C,T,G\"}";
}
std::string KMP_analytics_response(std::unordered_map<std::string,bool> mp){
  std::stringstream response;
  response<<"{";
  response<<"\"cancer\""<<":"<<mp[mutations[0]]<<",";
  response<<"\"cysticfibrosis\""<<":"<<mp[mutations[1]]<<",";
  response<<"\"hemophilia\""<<":"<<mp[mutations[2]]<<",";
  response<<"\"huntington\""<<":"<<mp[mutations[3]]<<",";
  response<<"\"nf1\""<<":"<<mp[mutations[4]];
  response<<"}";
  return response.str();
}

std::string mutations_analysis(std::string genome){
  genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
  if(!is_valid_genome(genome)){
    return inputfile_error_message();
  }
  std::unordered_map<std::string,bool> mp;
  for(int i=0;i<5;i++){
    std::ifstream t(mutations[i]);
    std::stringstream buffer;
    buffer << t.rdbuf();
    std::string mutation=buffer.str();
    mutation.erase(std::remove(mutation.begin(), mutation.end(), '\n'), mutation.end());
    std::vector<int> v=KMP_search(genome,mutation);
    mp[mutations[i]]=(v.size()>0);
  }
  return KMP_analytics_response(mp);
}