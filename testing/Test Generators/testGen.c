#include<stdio.h>
#include<stdlib.h>
#include <time.h> 
#include<string.h>
char* mutation_files[7] = {"cancer","cysticfibrosis","hemophilia","huntington","nf1","none","none"}; //adding "none" twice to make probability of no mutation ocurring slightly higher than the rest of the mutations;
char protein[4]={'A','T','G','C'};
typedef struct test_case_metadata{
    unsigned long int total_chars;
    char * mutation;
    int segment_len; //for building the genetic sequence segment by segment
}metadata;

metadata new_test_case(){
   metadata tc;
   tc.total_chars=(rand()%(10000001-800000))+500000;
   tc.mutation=mutation_files[(rand()%7)];
   tc.segment_len=(rand()%(501-21))+21;
   return tc;
}

char * tostring(unsigned long int num)
{
    int i, rem, len = 0, n;
    
    n = num;
    while (n != 0)
    {
        len++;
        n /= 10;
    }
    char * str=(char*)malloc(sizeof(char)*(len+1));
    for (i = 0; i < len; i++)
    {
        rem = num % 10;
        num = num / 10;
        str[len - (i + 1)] = rem + '0';
    }
    str[len] = '\0';
    return str;
}
char * get_tc_file_name(metadata tc){
    char* filename=(char*)malloc(sizeof(char)*512);
    strcat(filename,tc.mutation);
    strcat(filename,"_");
    strcat(filename,tostring(tc.total_chars));
    strcat(filename,"_");
    strcat(filename,tostring(tc.segment_len));
    strcat(filename,".txt");
    return filename;
}
char * get_mutation_file(char * mutation){
    char* filename=(char*)malloc(sizeof(char)*512);
    strcat(filename,"./mutations/");
    strcat(filename,mutation);
    strcat(filename,".txt");
    return filename;
}
void genTC(metadata tc){
    long int tot_chars=tc.total_chars;
    const char * newfile=get_tc_file_name(tc);
    FILE * tc_file=fopen(newfile,"a");
    if(!tc_file){
        perror("Cannot Create TC file!");
        exit(EXIT_FAILURE);
    }
    FILE * mutation_file=NULL;
    double proba;
    int put_mutation=0;
    char * mutation_file_path;
    while(tot_chars>0){
        proba=(((double)rand()) / RAND_MAX);
        if(proba>0.4){
            for(int i=0;i<tc.segment_len;i++){
                fputc(protein[rand()%4],tc_file);
            }
            tot_chars-=tc.segment_len;
        }
        else if(strcmp(tc.mutation,"none")!=0){
            int written_len=0;
            if(put_mutation==0){
                mutation_file_path=get_mutation_file(tc.mutation);
                mutation_file=fopen(mutation_file_path,"r");
                if(!mutation_file){
                    printf("%s\n",mutation_file_path);
                    perror("Cannot open mutation file!");
                    exit(EXIT_FAILURE);
                }
                char ch;
                
                do
                {
                    ch=fgetc(mutation_file);
                    if (ch != EOF) {
                        fputc(ch, tc_file);
                        written_len += 1;
                    }
                } while (ch!=EOF);
                put_mutation=1;
                
            }
            else{
                proba=(((double)rand()) / RAND_MAX);
                if(proba<=0.15){
                    mutation_file_path=get_mutation_file(mutation_files[rand()%5]);
                    mutation_file=fopen(mutation_file_path,"r");
                    if(!mutation_file){
                        printf("%s\n",mutation_file_path);
                        perror("Cannot open mutation file!");
                        exit(EXIT_FAILURE);
                    }
                    char ch;
                    do
                    {
                        ch=fgetc(mutation_file);
                        if (ch != EOF) {
                            fputc(ch, tc_file);
                            written_len += 1;
                        }
                    } while (ch!=EOF);
                    put_mutation=1;
                }
            }
            tot_chars-=written_len;
        }
    }
    if (tc_file != NULL) {
        fclose(tc_file);
    }

    if (mutation_file != NULL) {
        fclose(mutation_file);
    }

}
void print_tc_metadata(metadata tc){
    printf("Total characters: %ld\n",tc.total_chars);
    printf("Mutation: %s\n",tc.mutation);
    printf("Segment length: %d\n",tc.segment_len);
    char * filename=get_tc_file_name(tc);
    printf("File Name: %s\n",filename);
}
int main(){
    // number of characters in file
    // what mutation it will contain (if any)
    // repeat gene sequence or gen new one 
    // if repeating a gen sequence, randomly generate that with a specific size in a random range
    srand(time(0));
    metadata tc=new_test_case();
    print_tc_metadata(tc);
    genTC(tc);
    // char * file=get_mutation_file(mutation_files[rand()%5]);
    // printf("%s\n",file);
    // FILE * f= fopen(file,"r");
    // if(!f){
    //     printf("File doesnt exist!\n");
    // }
    return 0;
}