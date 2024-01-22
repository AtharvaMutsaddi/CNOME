#include "httplib.h"
#include "analytics.h"
#include<vector>
// KMP search algo

int main(void)
{
  using namespace httplib;

  Server svr;
  std::cout<<"Server Listening on http://localhost:1234"<<std::endl;
  svr.Post("/upload", [&](const Request& req, Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::string result=mutations_analysis(file.content);
        // for(auto i: KMer_analysis(file.content,21)){
        //   std::cout<<i.first<<":"<<i.second<<std::endl;
        // }
        std::cout<<get_mapped_analysis_response(KMer_analysis(file.content,21))<<std::endl;
        res.set_content(result, "text/json");
    });
  
  svr.listen("localhost", 1234);
}