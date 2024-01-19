#include "httplib.h"
#include "analytics.h"
#include<vector>
// KMP search algo
const char* mutations[5]={
  "./mutations/cancer.txt",
  "./mutations/cysticfibrosis.txt",
  "./mutations/hemophilia.txt",
  "./mutations/huntington.txt",
  "./mutations/nf1.txt"
};

int main(void)
{
  using namespace httplib;

  Server svr;
  std::cout<<"Server Listening on http://localhost:1234"<<std::endl;
  svr.Post("/upload", [&](const Request& req, Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::unordered_map<std::string,bool> mp;
        // std::cout<<file.name<<std::endl;
        // std::cout<<file.content<<std::endl;
        // std::cout<<file.filename<<std::endl;
        // std::cout<<file.content_type<<std::endl;
        std::string genome=file.content;
        genome.erase(std::remove(genome.begin(), genome.end(), '\n'), genome.end());
        for(int i=0;i<5;i++){
          std::ifstream t(mutations[i]);
          std::stringstream buffer;
          buffer << t.rdbuf();
          std::string mutation=buffer.str();
          mutation.erase(std::remove(mutation.begin(), mutation.end(), '\n'), mutation.end());
          std::vector<int> v=KMP_search(genome,mutation);
          mp[mutations[i]]=(v.size()>0);
        }
        std:: stringstream response;
        response<<"{";
        response<<"\"cancer\""<<":"<<mp[mutations[0]]<<",";
        response<<"\"cysticfibrosis\""<<":"<<mp[mutations[1]]<<",";
        response<<"\"hemophilia\""<<":"<<mp[mutations[2]]<<",";
        response<<"\"huntington\""<<":"<<mp[mutations[3]]<<",";
        response<<"\"nf1\""<<":"<<mp[mutations[4]];
        response<<"}";
        res.set_content(response.str(), "text/json");
    });
  
  svr.listen("localhost", 1234);
}