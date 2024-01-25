#include "httplib.h"
#include "analytics.h"
#include <vector>
// KMP search algo

int main(void)
{
  using namespace httplib;

  Server svr;
  std::cout << "Server Listening on http://localhost:1234" << std::endl;
  svr.Post("/mutations", [&](const Request &req, Response &res)
           {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::string result=mutations_analysis(file.content);
        res.set_content(result, "text/json"); });

  svr.Post("/kmer", [&](const Request &req, Response &res)
           {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::string result=get_mapped_analysis_response(KMer_analysis(file.content,21));
        res.set_content(result, "text/json"); });

  

  svr.listen("localhost", 1234);
}