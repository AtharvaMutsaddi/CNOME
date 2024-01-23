#include "analytics.h" 
const char* mutations[5]={
  "cancer.txt",
  "cysticfibrosis.txt",
  "hemophilia.txt",
  "huntington.txt",
  "nf1.txt"
};
bool KMP_search(std::string genome,std::string mutation){
  long long int n=genome.length();
  long long int k=mutation.length();
  if(n<k){
    return false;
  }
  for(long long int i=0;i<n;i++){
    if(genome[i]==mutation[0]){
      std::string s=genome.substr(i,k);
      if(s==mutation){
        return true;
      }
    }
  }
  return false;
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
    mp[mutations[i]]=KMP_search(genome,mutation);
  }
  return get_mapped_analysis_response(mp);
}
std::unordered_map<std::string,int> KMer_analysis(std::string genome, int k){
  genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
  std::unordered_map<std::string,int> freq_mapping;
  std::string kmer;
  int n=genome.length();
  for(int i=0;i<n-k;i++){
    kmer=genome.substr(i,k);
    freq_mapping[compressAndEncodeBase64(kmer)]+=1;
  }
  for (auto it = freq_mapping.begin(); it != freq_mapping.end();) {
        if (it->second <= 1) {
            it = freq_mapping.erase(it);
        } else {
            ++it;
        }
    }
  freq_mapping["totalKmers"]=n-k+1;
  if(n-k+1<0){
    freq_mapping["totalKmers"]=0;
  }
  return freq_mapping;
}