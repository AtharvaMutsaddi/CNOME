#include "analytics.h"
const char *mutations[5] = {
    "cancer.txt",
    "cysticfibrosis.txt",
    "hemophilia.txt",
    "huntington.txt",
    "nf1.txt"};
bool KMP_search(std::string genome, std::string mutation)
{
  long long int n = genome.length();
  long long int k = mutation.length();
  if (n < k)
  {
    return false;
  }
  for (long long int i = 0; i < n; i++)
  {
    if (genome[i] == mutation[0])
    {
      std::string s = genome.substr(i, k);
      if (s == mutation)
      {
        return true;
      }
    }
  }
  return false;
}
bool is_valid_genome(std::string genome)
{
  for (char c : genome)
  {
    if (c != 'A' && c != 'T' && c != 'G' && c != 'C')
    {
      return false;
    }
  }
  return true;
}

std::string mutations_analysis(std::string genome)
{
  genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
  if (!is_valid_genome(genome))
  {
    return get_inputfile_error_message();
  }
  std::unordered_map<std::string, int> mp;
  for (int i = 0; i < 5; i++)
  {
    char MUTATION_PATH_PREFIX[512] = "../mutations/";
    char *mutation_file_path = strcat(MUTATION_PATH_PREFIX, mutations[i]);
    std::ifstream t(mutation_file_path);
    std::stringstream buffer;
    buffer << t.rdbuf();
    std::string mutation = buffer.str();
    mutation.erase(std::remove(mutation.begin(), mutation.end(), '\n'), mutation.end());
    mp[mutations[i]] = KMP_search(genome, mutation);
  }
  return get_mapped_analysis_response(mp);
}
std::unordered_map<std::string, int> KMer_analysis(std::string genome, int k)
{
  genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
  std::unordered_map<std::string, int> freq_mapping;
  if (!is_valid_genome(genome))
  {
    return freq_mapping;
  }
  std::string kmer;
  int n = genome.length();
  for (int i = 0; i < n - k; i++)
  {
    kmer = genome.substr(i, k);
    freq_mapping[compressAndEncodeBase64(kmer)] += 1;
  }
  for (auto it = freq_mapping.begin(); it != freq_mapping.end();)
  {
    if (it->second <= 5)
    {
      it = freq_mapping.erase(it);
    }
    else
    {
      ++it;
    }
  }
  freq_mapping["totalKmers"] = n - k + 1;
  if (n - k + 1 < 0)
  {
    freq_mapping["totalKmers"] = 0;
  }
  return freq_mapping;
}
double levenshtein_dist(std::string s, std::string t)
{
  long long int m = std::min((int)s.size(), 800000);
  long long int n = std::min((int)t.size(), 800000);
  std::cout << "Computing Edit dist" << std::endl;
  std::vector<long long int> prev(n + 1, 0), curr(n + 1, 0);

  for (long long int j = 0; j <= n; j++)
  {
    prev[j] = j;
  }

  for (long long int i = 1; i <= m; i++)
  {
    curr[0] = i;
    for (long long int j = 1; j <= n; j++)
    {
      if (s[i - 1] == t[j - 1])
      {
        curr[j] = prev[j - 1];
      }
      else
      {
        long long int mn = std::min(1 + prev[j], 1 + curr[j - 1]);
        curr[j] = std::min(mn, 1 + prev[j - 1]);
      }
    }
    prev = curr;
  }

  long long dist = prev[n];
  long long mxlen = std::max(n, m);
  std::cout << "Done with Lev" << std::endl;
  return (1.0 - static_cast<double>(dist / mxlen)) * 100;
}
std::unordered_map<std::string, int> getNGrams(std::string str, int n) {
    std::unordered_map<std::string, int> ngrams;
    for (int i = 0; i <= str.size() - n; ++i) {
        std::string ngram = str.substr(i, n);
        ngrams[ngram]++;
    }
    return ngrams;
}

double calculateNgramSimilarity(std:: string str1, std:: string str2) {
    int n=21;
    std::unordered_map<std::string, int> ngrams1 = getNGrams(str1, n);
    std::unordered_map<std::string, int> ngrams2 = getNGrams(str2, n);

    int common = 0;
    for (auto it : ngrams1) {
        common += std::min(it.second, ngrams2[it.first]);
    }
    int allKMers=0;
    for(auto it: ngrams1){
      allKMers+=(it.second);
    }
    for(auto it: ngrams2){
      allKMers+=(it.second);
    }
    int total = allKMers - common;
    return (static_cast<double>(common) / total)*100.0;
}
double jaccard_index(std::string genome1, std::string genome2)
{
  std::cout << "Computing jaccard index dist" << std::endl;
  std::unordered_set<std::string> set1, set2;
  int k = 21;
  for (int i = 0; i <= genome1.length() - k; ++i)
  {
    set1.insert(genome1.substr(i, k));
  }

  for (int i = 0; i <= genome2.length() - k; ++i)
  {
    set2.insert(genome2.substr(i, k));
  }
  // Calculate Jaccard Index
  std::unordered_set<std::string> intersection, unionSet;
  for (const auto &kmer : set1)
  {
    if (set2.count(kmer))
    {
      intersection.insert(kmer);
    }
    unionSet.insert(kmer);
  }
  for (const auto &kmer : set2)
  {
    unionSet.insert(kmer);
  }
  std::cout << "Done with Jaccard" << std::endl;
  return (static_cast<double>(intersection.size()) / unionSet.size()) * 100.0;
}
// std::string lcs(std::string genome1, std::string genome2)
// {
//   long long int n = genome1.length();
//   long long int m = genome2.length();
//   std::vector<std::vector<int>> dp(n + 1, std::vector<int>(m + 1));
//   for (long long int i = n - 1; i >= 0; i--)
//   {
//     for (long long int j = m - 1; j >= 0; j--)
//     {
//       if (genome1[i] == genome2[j])
//       {
//         dp[i][j] = 1 + dp[i + 1][j + 1];
//       }
//       else
//       {
//         dp[i][j] = 1 + std::max(dp[i][j + 1], dp[i + 1][j]);
//       }
//     }
//   }
//   std::string ans = "";
//   long long int i = 0, j = 0;
//   while (i < n && j < m)
//   {
//     if (genome1[i] == genome2[j])
//     {
//       ans += genome1[i];
//       i++;
//       j++;
//     }
//     else
//     {
//       if (dp[i + 1][j] >= dp[i][j + 1])
//       {
//         i++;
//       }
//       else
//       {
//         j++;
//       }
//     }
//   }
//   return ans;
// }
double sequence_identity(std::string genome1, std::string genome2)
{
  std::cout << "Computing seq id dist" << std::endl;
  int length = std::min(genome1.length(), genome2.length());
  int matchedPositions = 0;

  // Count matched positions
  for (int i = 0; i < length; ++i)
  {
    if (genome1[i] == genome2[i])
    {
      matchedPositions++;
    }
  }
  // Calculate sequence identity percentage
  double sequenceIdentity = (static_cast<double>(matchedPositions) / length) * 100.0;
  std::cout << "Done with Seq" << std::endl;
  return sequenceIdentity;
}
void *compute_metric(void *arg)
{
  ThreadData *data = static_cast<ThreadData *>(arg);
  int result = data->metric_function(data->genome1, data->genome2);
  std::string metric_name;
  if (data->metric_function == calculateNgramSimilarity)
  {
    metric_name = "KMer Similarity";
  }
  if (data->metric_function == sequence_identity)
  {
    metric_name = "Sequence Identity";
  }
  else if (data->metric_function == jaccard_index)
  {
    metric_name = "Jaccard Index";
  }
  data->mp->insert({metric_name, result});
  pthread_exit(NULL);
}
std::string similarity_report(std::string genome1, std::string genome2)
{
  if (!is_valid_genome(genome1) || !is_valid_genome(genome2))
  {
    return get_inputfile_error_message();
  }
  std::unordered_map<std::string, int> mp;
  pthread_t threads[3];
  ThreadData threadData[3] = {
      {genome1, genome2, &mp, calculateNgramSimilarity},
      {genome1, genome2, &mp, sequence_identity},
      {genome1, genome2, &mp, jaccard_index}};

  for (int i = 0; i < 3; ++i)
  {
    pthread_create(&threads[i], NULL, compute_metric, &threadData[i]);
  }
  for (int i = 0; i < 3; ++i)
  {
    pthread_join(threads[i], NULL);
  }
  return get_mapped_analysis_response(mp);
}