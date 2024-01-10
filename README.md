# Setup:


## Requirements

1. Ubuntu Linux (preferably dual booted) as I have tested on an Ubuntu System only
2. OpenSSL Development Package can be installed by running: 
```
sudo apt-get update
sudo apt-get install libssl-dev
```
3. CMake must be installed 
4. Some application to test the API endpoints: Postman or Thunderclient
5. Live Server Extension on Vscode 

## Set Up:

1. Build:
```
mkdir build
cd build
cmake ..
make
```

2. run executable:
```
./test
```

**Note:** Server will be running on http://localhost:1234/

3. Click Go Live to make the index.html file run
4. Send any text file in the input and the output of the file should be displayed in backend terminal (That is all I have programmed it to do as of now)