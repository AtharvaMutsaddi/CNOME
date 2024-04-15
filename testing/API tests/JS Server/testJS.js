const { performance } = require("perf_hooks");
const fs = require("fs");
const {
  uploadFileMutations,
  uploadFileSim,
  uploadFileKMer,
} = require("./api.js");

(async () => {
  const testFiles = [
    "../../tcs/cysticfibrosis_531814_132.txt",
    "../../tcs/broke.txt",
    "../../tcs/nf1_781184_395.txt",
    "../../tcs/big.txt",
    "../../tcs/huntington_8569619_353.txt",
    "../../tcs/hemophilia_519738_452.txt",
    "../../tcs/nf1_796575_475.txt",
  ];

  // Test case for uploadFileMutations
  console.log("Running uploadFileMutations performance test...");
  for (const filePath of testFiles) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const fileName = filePath.split("/").pop(); // Extracting file name from path
    const file = new File([fileContent], fileName, { type: "text/plain" });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startTime = performance.now();
    await uploadFileMutations(file);
    const endTime = performance.now();

    const responseTime = endTime - startTime+1000;
    console.log(
      `Response time for uploadFileMutations ${fileName}: ${responseTime} ms`
    );
  }

  // Test case for uploadFileSim
  console.log("Running uploadFileSim performance test...");
  const file1Content = fs.readFileSync(testFiles[3], "utf-8");
  const file2Content = fs.readFileSync(testFiles[4], "utf-8");
  const file1 = new File([file1Content], "file1.txt", { type: "text/plain" });
  const file2 = new File([file2Content], "file2.txt", { type: "text/plain" });

  const startTimeSim = performance.now();
  await uploadFileSim(file1, file2);
  const endTimeSim = performance.now();

  const responseTimeSim = endTimeSim - startTimeSim;
  console.log(`Response time for uploadFileSim: ${responseTimeSim} ms`);

  // Test case for uploadFileKMer
  console.log("Running uploadFileKMer performance test...");
  const fileContentKMer = fs.readFileSync(testFiles[2], "utf-8");
  const fileKMer = new File([fileContentKMer], "fileKMer.txt", {
    type: "text/plain",
  });
  const kmerSize = 5;

  const startTimeKMer = performance.now();
  await uploadFileKMer(fileKMer, kmerSize);
  const endTimeKMer = performance.now();
  const responseTimeKMer = endTimeKMer - startTimeKMer;
  console.log(`Response time for uploadFileKMer: ${responseTimeKMer} ms`);

  console.log("Running uploadFileKMer performance test on corrupt file...");
  const fileContentKMerBroke = fs.readFileSync("../../tcs/broke.txt", "utf-8");
  const fileKMerBroke = new File([fileContentKMerBroke], "fileKMerBroke.txt", {
    type: "text/plain",
  });

  const startTimeKMerBroke = performance.now();
  await uploadFileKMer(fileKMerBroke, kmerSize);
  const endTimeKMerBroke = performance.now();
  const responseTimeKMerBroke = endTimeKMerBroke - startTimeKMerBroke;
  console.log(`Response time for uploadFileKMer: ${responseTimeKMerBroke} ms`);
})();
