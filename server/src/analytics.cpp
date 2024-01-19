#include "analytics.h" 

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