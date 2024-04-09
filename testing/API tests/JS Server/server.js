const http = require('http');
const fs = require('fs');
const multer = require('multer'); // Middleware for handling multipart/form-data
const upload = multer();

const port = 1412;
function getMappedAnalysisResponse(mp) {
    let response = '{';
    for (const [key, value] of Object.entries(mp)) {
        response += `"${key}": ${value},`;
    }
    response = response.slice(0, -1) + '}';
    if (response.length === 1) {
        return "";
    }
    return response;
}
function isValidGenome(genome) {
    for (let i = 0; i < genome.length; i++) {
        const c = genome[i];
        if (c !== "A" && c !== "T" && c !== "G" && c !== "C") {
            return false;
        }
    }
    return true;
}

function KMPSearch(genome, mutation) {
    const n = genome.length;
    const k = mutation.length;
    if (n < k) {
        return false;
    }
    for (let i = 0; i < n; i++) {
        if (genome[i] === mutation[0]) {
            const s = genome.substr(i, k);
            if (s === mutation) {
                return true;
            }
        }
    }
    return false;
}

async function mutationsAnalysis(genome) {
    genome = genome.replace(/\n/g, "");
    if (!isValidGenome(genome)) {
        return { error: "Invalid genome sequence" };
    }

    const mp = {};
    const mutations = [
        "cancer.txt",
        "cysticfibrosis.txt",
        "hemophilia.txt",
        "huntington.txt",
        "nf1.txt",
    ]; 

    const promises = mutations.map((mutation) => {
        return new Promise((resolve, reject) => {
            const mutationFilePath = `./mutations/${mutation}`;
            fs.readFile(mutationFilePath, "utf-8", (err, mutationContent) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                const cleanedMutation = mutationContent.replace(/\n/g, "");
                mp[mutation] = KMPSearch(genome, cleanedMutation);
                resolve();
            });
        });
    });

    await Promise.all(promises);
    getMappedAnalysisResponse(mp);
    console.log(mp);
    return mp;
}

function getNGrams(str, n) {
    const ngrams = {};
    for (let i = 0; i <= str.length - n; ++i) {
        const ngram = str.substr(i, n);
        ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
    return ngrams;
}

function calculateNgramSimilarity(str1, str2) {
    const n = 21;
    const ngrams1 = getNGrams(str1, n);
    const ngrams2 = getNGrams(str2, n);

    let common = 0;
    for (const ngram1 in ngrams1) {
        for (const ngram2 in ngrams2) {
            if (ngram1 === ngram2) {
                common += Math.min(ngrams1[ngram1], ngrams2[ngram2]);
            }
        }
    }

    let allKMers = 0;
    for (const count1 of Object.values(ngrams1)) {
        allKMers += count1;
    }
    for (const count2 of Object.values(ngrams2)) {
        allKMers += count2;
    }

    const total = allKMers - common;
    return (common / total) * 100;
}

function jaccardIndex(genome1, genome2) {
    console.log("Computing jaccard index dist");
    const k = 21;
    const set1 = [];
    const set2 = [];

    for (let i = 0; i <= genome1.length - k; ++i) {
        set1.push(genome1.substr(i, k));
    }

    for (let i = 0; i <= genome2.length - k; ++i) {
        set2.push(genome2.substr(i, k));
    }

    const intersection = [];
    const unionSet = [];

    for (const kmer1 of set1) {
        for (const kmer2 of set2) {
            if (kmer1 === kmer2) {
                intersection.push(kmer1);
            }
        }
        unionSet.push(kmer1);
    }

    for (const kmer2 of set2) {
        if (!unionSet.includes(kmer2)) {
            unionSet.push(kmer2);
        }
    }

    console.log("Done with Jaccard");
    return (intersection.length / unionSet.length) * 100;
}

function sequenceIdentity(genome1, genome2) {
    console.log("Computing seq id dist");
    const length = Math.min(genome1.length, genome2.length);
    let matchedPositions = 0;

    // Count matched positions
    for (let i = 0; i < length; ++i) {
        if (genome1[i] === genome2[i]) {
            matchedPositions++;
        }
    }

    // Calculate sequence identity percentage
    const sequenceIdentity = (matchedPositions / length) * 100;
    console.log("Done with Seq");
    return sequenceIdentity;
}

function computeMetric(genome1, genome2, metricFunction) {
    return new Promise((resolve, reject) => {
        metricFunction(genome1, genome2).then((result) => {
            let metricName;
            if (metricFunction === calculateNgramSimilarity) {
                metricName = "KMer Similarity";
            } else if (metricFunction === sequenceIdentity) {
                metricName = "Sequence Identity";
            } else if (metricFunction === jaccardIndex) {
                metricName = "Jaccard Index";
            }
            resolve({ [metricName]: result });
        }).catch((error) => {
            reject(error);
        });
    });
}

async function similarityReport(genome1, genome2) {
    const mp = {};
    const threadData = [
        { genome1, genome2, metricFunction: calculateNgramSimilarity },
        { genome1, genome2, metricFunction: sequenceIdentity },
        { genome1, genome2, metricFunction: jaccardIndex },
    ];

    const promises = threadData.map((data) =>
        computeMetric(data.genome1, data.genome2, data.metricFunction)
    );
    const results = await Promise.all(promises);

    results.forEach((result) => Object.assign(mp, result));
    getMappedAnalysisResponse(mp)
    return mp;
}

function kMerAnalysis(genome, k) {
    genome = genome.replace(/\n/g, ""); // Remove newline characters
    const freqMapping = {};

    if (!isValidGenome(genome)) {
        return freqMapping;
    }

    for (let i = 0; i < genome.length - k; i++) {
        const kMer = genome.substr(i, k);
        freqMapping[kMer] = (freqMapping[kMer] || 0) + 1;
    }

    for (const key in freqMapping) {
        if (freqMapping[key] <= 5) {
            delete freqMapping[key];
        }
    }

    freqMapping["totalKmers"] = Math.max(0, genome.length - k + 1);
    getMappedAnalysisResponse(freqMapping)
    return freqMapping;
}

function getMappedAnalysisResponse(mp) {
    let response = '{';
    for (const [key, value] of Object.entries(mp)) {
        response += `"${key}": ${value},`;
    }
    response = response.slice(0, -1) + '}';
    if (response.length === 1) {
        return "";
    }
    return response;
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'POST') {
        if (req.url === '/mutations') {
            upload.single('file')(req, res, async () => {
                const genome = req.file.buffer.toString(); // Get file content from request
                const result = await mutationsAnalysis(genome);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result)); // Respond with JSON
            });
        } else if (req.url.startsWith('/kmer/')) {
            upload.single('file')(req, res, () => {
                const genome = req.file.buffer.toString(); // Get file content from request
                const k = parseInt(req.url.split('/').pop()); // Get kmerSize from URL parameter
                const result = kMerAnalysis(genome, k);
                console.log(result)
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result)); // Respond with JSON
            });
        } else if (req.url === '/sim') {
            upload.fields([{ name: 'file1' }, { name: 'file2' }])(req, res, () => {
                const genome1 = req.files['file1'][0].buffer.toString(); // Get file1 content from request
                const genome2 = req.files['file2'][0].buffer.toString(); // Get file2 content from request
                similarityReport(genome1, genome2).then((result) => {
                    res.setHeader('Content-Type', 'application/json');
                    console.log(result)
                    res.end(JSON.stringify(result)); // Respond with JSON
                });
            });
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    } else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
});

server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
