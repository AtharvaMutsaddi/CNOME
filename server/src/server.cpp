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

  svr.Post("/kmer/:kmerSize", [&](const Request &req, Response &res)
           {
            std::cout<<req.path_params.at("kmerSize")<<std::endl;
            int k=stoi(req.path_params.at("kmerSize"));
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::string result=get_mapped_analysis_response(KMer_analysis(file.content,k));
        res.set_content(result, "text/json"); });
  svr.Post("/sim", [&](const Request &req, Response &res)
           {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file1 = req.get_file_value("file1");
        const auto& file2 = req.get_file_value("file2");
        std::cout<<file1.content.length()<<std::endl;
        std::cout<<file2.content.length()<<std::endl;
        std::string result=similarity_report(file1.content,file2.content);
        std::cout<<result<<std::endl;
        res.set_content(result, "text/json"); });

  svr.listen("localhost", 1234);
}