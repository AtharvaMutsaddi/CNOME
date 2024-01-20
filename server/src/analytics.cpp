#include "analytics.h" 
const char* mutations[5]={
  "cancer.txt",
  "cysticfibrosis.txt",
  "hemophilia.txt",
  "huntington.txt",
  "nf1.txt"
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

std::string mutations_analysis(std::string genome){
  genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
  if(!is_valid_genome(genome)){
    return get_inputfile_error_message();
  }
  std::unordered_map<std::string,int> mp;
  for(int i=0;i<5;i++){
    char MUTATION_PATH_PREFIX[512]="../mutations/";
    char * mutation_file_path=strcat(MUTATION_PATH_PREFIX,mutations[i]);
    std::ifstream t(mutation_file_path);
    std::stringstream buffer;
    buffer << t.rdbuf();
    std::string mutation=buffer.str();
    mutation.erase(std::remove(mutation.begin(), mutation.end(), '\n'), mutation.end());
    std::vector<int> v=KMP_search(genome,mutation);
    mp[mutations[i]]=(v.size()>0);
  }
  return get_mapped_analysis_response(mp);
}
std::unordered_map<std::string,int> KMer_analysis(std::string genome, int k){
  std::unordered_map<std::string,int> freq_mapping;
  std::string kmer;
  int n=genome.length();
  for(int i=0;i<n-k;i++){
    kmer=genome.substr(i,k);
    freq_mapping[compressAndEncodeBase64(kmer)]+=1;
  }
  for(auto i: freq_mapping){
    if(i.second<=1){
      freq_mapping.erase(i.first);
    }
  }
  freq_mapping["totalKmers"]=n-k+1;
  return freq_mapping;
}