#include "httplib.h"

int main(void)
{
  using namespace httplib;

  Server svr;

  svr.Get("/hi", [](const Request& req, Response& res) {
    res.set_content("{\"message\":\"Hello World!\"}", "text/plain");
  });

  // Match the request path against a regular expression
  // and extract its captures
  svr.Get(R"(/numbers/(\d+))", [&](const Request& req, Response& res) {
    auto numbers = req.matches[1];
    res.set_content(numbers, "text/plain");
  });

  // Capture the second segment of the request path as "id" path param
  svr.Get("/users/:id", [&](const Request& req, Response& res) {
    auto user_id = req.path_params.at("id");
    res.set_content(user_id, "text/plain");
  });

  // Extract values from HTTP headers and URL query params
  svr.Get("/body-header-param", [](const Request& req, Response& res) {
    if (req.has_header("Content-Length")) {
      auto val = req.get_header_value("Content-Length");
    }
    if (req.has_param("key")) {
      auto val = req.get_param_value("key");
    }
    res.set_content(req.body, "text/plain");
  });

  svr.Get("/stop", [&](const Request& req, Response& res) {
    res.set_content("{\"message\":\"Bye Bye!\"}", "text/plain");
    svr.stop();
  });
  svr.Post("/upload", [&](const Request& req, Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        const auto& file = req.get_file_value("file");
        std::cout<<file.name<<std::endl;
        std::cout<<file.content<<std::endl;
        std::cout<<file.filename<<std::endl;
        std::cout<<file.content_type<<std::endl;
        res.set_content("File Recieved Successfully!", "text/plain");
        // if (!file.empty()) {
        // std::ofstream output("uploaded_file.txt", std::ios::out | std::ios::binary);
        // output.write((const char *)file.content, file.length);
        // output.close();

        //     res.set_content("File received successfully", "text/plain");
        // } else {
        //     res.set_content("Failed to receive the file", "text/plain");
        // }

    });



  svr.listen("localhost", 1234);
}