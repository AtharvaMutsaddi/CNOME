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

double levenshtein_dist(std::string genome1,std::string genome2){
  long long int n=genome1.length();
  long long int m=genome2.length();
  std::vector<std::vector<long long int>> dp(n,std::vector<long long int>(m,0));
  for(long long int i=0;i<n;i++){
    dp[i][m]=n-i;
  }
  for(long long int i=0;i<m;i++){
    dp[n][i]=m-i;
  }
  dp[n][m]=0;
  for(long long int i=n-1;i>=0;i--){
    for(long long int j=m-1;j>=0;j--){
      if(genome1[i]==genome2[j]){
        dp[i][j]=dp[i+1][j+1];
      }
      else{
        dp[i][j]=1+std::max(dp[i+1][j],std::max(dp[i][j+1],dp[i+1][j+1]));
      }
    }
  }
  long long min_changes=dp[0][0];
  long long max_size=std::max(n,m);
  return (1-(static_cast<double>(min_changes)/max_size))*100.0;
}

double jaccard_index(std::string genome1,std::string genome2){
  std::unordered_set<std::string> set1, set2;
    int k=21;
    for (int i = 0; i <= genome1.length() - k; ++i) {
        set1.insert(genome1.substr(i, k));
    }

    for (int i = 0; i <= genome2.length() - k; ++i) {
        set2.insert(genome2.substr(i, k));
    }

    // Calculate Jaccard Index
    std::unordered_set<std::string> intersection, unionSet;
    for (const auto& kmer : set1) {
        if (set2.count(kmer)) {
            intersection.insert(kmer);
        }
        unionSet.insert(kmer);
    }

    for (const auto& kmer : set2) {
        unionSet.insert(kmer);
    }
    return (static_cast<double>(intersection.size()) / unionSet.size())*100.0;
}

double sequence_identity(std::string genome1,std::string genome2){
  
    int length = std::min(genome1.length(),genome2.length());
    int matchedPositions = 0;

    // Count matched positions
    for (int i = 0; i < length; ++i) {
        if (genome1[i] == genome1[i]) {
            matchedPositions++;
        }
    }

    // Calculate sequence identity percentage
    double sequenceIdentity = (static_cast<double>(matchedPositions) / length) * 100.0;

    return sequenceIdentity;
}