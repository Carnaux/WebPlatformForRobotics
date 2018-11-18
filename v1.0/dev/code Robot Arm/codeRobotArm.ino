#include <ESP8266WiFi.h> // Importa a Biblioteca ESP8266WiFi
#include <PubSubClient.h> // Importa a Biblioteca PubSubClient
#include "PCF8591.h"
#include <string.h>

#define PCF8591_I2C_ADDRESS 0x48
PCF8591 pcf8591(PCF8591_I2C_ADDRESS, 5, 4);




//defines:
//defines de id mqtt e tópicos para publicação e subscribe
#define TOPICO_SUBSCRIBE "MQTTEnvia"     //tópico MQTT de escuta
#define TOPICO_PUBLISH   "MQTTRecebe"    //tópico MQTT de envio de informações para Broker
                                                   //IMPORTANTE: recomendamos fortemente alterar os nomes
                                                   //            desses tópicos. Caso contrário, há grandes
                                                   //            chances de você controlar e monitorar o NodeMCU
                                                   //            de outra pessoa.
#define ID_MQTT  "IDUNICO"     //id mqtt (para identificação de sessão)
                               //IMPORTANTE: este deve ser único no broker (ou seja, 
                               //            se um client MQTT tentar entrar com o mesmo 
                               //            id de outro já conectado ao broker, o broker 
                               //            irá fechar a conexão de um deles).
                               


 
//defines - mapeamento de pinos do NodeMCU
#define D0    16
#define D1    5
#define D2    4
#define D3    0
#define D4    2
#define D5    14
#define D6    12
#define D7    13
#define D8    15
#define D9    3
#define D10   1


//int c2;
//String c22;
//PINOS DO MOTOR 
int enable = D1;
int enable2 = D2;
int Entrada1 = D3; //Ligado ao pino 7 do L293D 
int Entrada2 = D4;
//PINOS DO ENCODER
int encoder1 = D7;
int encoder2 = D8;
int dataEncoder1;
int dataEncoder2;
int counter = 0;

int encoder3 = D5;
int encoder4 = D6;
int dataEncoder3;
int dataEncoder4;
int counter2 = 0;
//bools
bool checkRun2;
bool checkRunReverse2;
bool checkRun;
bool checkRunReverse;


// STOPPER
int stopper = D7;
int buttoncheck = 0;
int LED  = D0;

// WIFI
//const char* SSID = "Residencial01"; // SSID
//const char* PASSWORD = "thiago6161"; 
const char* SSID = "TEAM-OBR"; // SSID / nome da rede WI-FI que deseja se conectar
const char* PASSWORD = "Ei, qual a senha do roteador?!?!"; // Senha da rede WI-FI que deseja se conectar
 //const char* SSID = "PAMONHA!PAMONHA!";
 //const char* PASSWORD = "batata1234"; 
 
// MQTT
const char* BROKER_MQTT = "iot.eclipse.org"; //URL do broker MQTT que se deseja utilizar
int BROKER_PORT = 1883; // Porta do Broker MQTT
 
 
//Variáveis e objetos globais
WiFiClient espClient; // Cria o objeto espClient
PubSubClient MQTT(espClient); // Instancia o Cliente MQTT passando o objeto espClient
char EstadoSaida = '0';  //variável que armazena o estado atual da saída
 
//Prototypes
void initSerial();
void initWiFi();
void initMQTT();
void reconectWiFi(); 
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void VerificaConexoesWiFIEMQTT(void);
void InitOutput(void);
bool ReadEncoders(int n);

void motorfunciona(int ql);
void motorpara(int ql); 
void motorreverse(int ql);

/* 
 *  Implementações das funções
 */
void setup() 
{
    pcf8591.begin();
    //inicializações:
    initSerial();
    initWiFi();
    initMQTT();

    pinMode(enable, OUTPUT);
    pinMode(enable2, OUTPUT);
    pinMode(Entrada1, OUTPUT);
    pinMode(Entrada2, OUTPUT);

    pinMode(encoder1, INPUT);
    pinMode(encoder2, INPUT);

     pinMode(encoder3, INPUT);
    pinMode(encoder4, INPUT);

     
    //pinMode(stopper, INPUT);
    bool checkRun2 = false;
    bool checkRun = false;


    
}
 
//Função: inicializa comunicação serial com baudrate 115200 (para fins de monitorar no terminal serial 
//        o que está acontecendo.
//Parâmetros: nenhum
//Retorno: nenhum
void initSerial() 
{
    Serial.begin(9600);
}
 
//Função: inicializa e conecta-se na rede WI-FI desejada
//Parâmetros: nenhum
//Retorno: nenhum
void initWiFi() 
{
    delay(10);
    Serial.println("------Conexao WI-FI------");
    Serial.print("Conectando-se na rede: ");
    Serial.println(SSID);
    Serial.println("Aguarde");
    
    reconectWiFi();
}
 
//Função: inicializa parâmetros de conexão MQTT(endereço do 
//        broker, porta e seta função de callback)
//Parâmetros: nenhum
//Retorno: nenhum
void initMQTT() 
{
    MQTT.setServer(BROKER_MQTT, BROKER_PORT);   //informa qual broker e porta deve ser conectado
    MQTT.setCallback(mqtt_callback);            //atribui função de callback (função chamada quando qualquer informação de um dos tópicos subescritos chega)
}
 
//Função: função de callback 
//        esta função é chamada toda vez que uma informação de 
//        um dos tópicos subescritos chega)
//Parâmetros: nenhum
//Retorno: nenhum
void mqtt_callback(char* topic, byte* payload, unsigned int length) 
{
    String msg;
 
    //obtem a string do payload recebido
    for(int i = 0; i < length; i++) 
    {
       char c = (char)payload[i];
       msg += c;
    }
  
    //toma ação dependendo da string recebida:

     if (msg.equals("AA"))
    {
        Serial.println("Recebi da Unity");
    }
   
    if (msg.equals("L"))
    {
        checkRun = true;
        motorfunciona(1);
        EstadoSaida = '1';
        Serial.println("Comando L recebido!");
    }

    if (msg.equals("L2"))
    {
        checkRun2 = true;
        motorfunciona(2);
        EstadoSaida = '2';
         Serial.println("Comando L2 recebido!");
    }
       
    if (msg.equals("D"))
    {   
        checkRun = false;
        checkRunReverse = false;
        motorpara(1);
        EstadoSaida = '3';
        Serial.println("Comando D recebido!");
    }
    
    if (msg.equals("D2"))
    { 
        checkRun2 = false;
        checkRunReverse2 = false;
        motorpara(2);
        EstadoSaida = '4';
        Serial.println("Comando D2 recebido!");
    }
    
    if (msg.equals("R"))
    {
        checkRunReverse = true;
        motorreverse(1);
        EstadoSaida = '5';
        Serial.println("Comando R recebido!");
    }
    
    if (msg.equals("R2"))
    {
        checkRunReverse2 = true;
        motorreverse(2);
        EstadoSaida = '6';
        Serial.println("Comando R2 recebido!");
    }
    
}
 
//Função: reconecta-se ao broker MQTT (caso ainda não esteja conectado ou em caso de a conexão cair)
//        em caso de sucesso na conexão ou reconexão, o subscribe dos tópicos é refeito.
//Parâmetros: nenhum
//Retorno: nenhum
void reconnectMQTT() 
{
    while (!MQTT.connected()) 
    {
        Serial.print("* Tentando se conectar ao Broker MQTT: ");
        Serial.println(BROKER_MQTT);
        if (MQTT.connect(ID_MQTT)) 
        {
            Serial.println("Conectado com sucesso ao broker MQTT!");
            MQTT.subscribe(TOPICO_SUBSCRIBE);
          
      
        } 
        else 
        {
            Serial.println("Falha ao reconectar no broker.");
            Serial.println("Havera nova tentatica de conexao em 2s");
            delay(2000);
        }
    }
}
 
//Função: reconecta-se ao WiFi
//Parâmetros: nenhum
//Retorno: nenhum
void reconectWiFi() 
{
    //se já está conectado a rede WI-FI, nada é feito. 
    //Caso contrário, são efetuadas tentativas de conexão
    if (WiFi.status() == WL_CONNECTED)
        return;
        
    WiFi.begin(SSID, PASSWORD); // Conecta na rede WI-FI
    
    while (WiFi.status() != WL_CONNECTED) 
    {
        delay(100);
        Serial.print(".");
    }
  
    Serial.println();
    Serial.print("Conectado com sucesso na rede ");
    Serial.print(SSID);
    Serial.println("IP obtido: ");
    Serial.println(WiFi.localIP());
}
 
//Função: verifica o estado das conexões WiFI e ao broker MQTT. 
//        Em caso de desconexão (qualquer uma das duas), a conexão
//        é refeita.
//Parâmetros: nenhum
//Retorno: nenhum
void VerificaConexoesWiFIEMQTT(void)
{
    if (!MQTT.connected()) 
        reconnectMQTT(); //se não há conexão com o Broker, a conexão é refeita
    
     reconectWiFi(); //se não há conexão com o WiFI, a conexão é refeita
}
 
//Função: envia ao Broker o estado atual do output 
//Parâmetros: nenhum
//Retorno: nenhum
void EnviaEstadoOutputMQTT(void)
{ 
 
}
 
//Função: inicializa o output em nível lógico baixo
//Parâmetros: nenhum
//Retorno: nenhum

//programa principal
void loop() 
{   
    //garante funcionamento das conexões WiFi e ao broker MQTT
    VerificaConexoesWiFIEMQTT();
 
    //envia o status de todos os outputs para o Broker no protocolo esperado
    //EnviaEstadoOutputMQTT();
 
    //keep-alive da comunicação com broker MQTT
    MQTT.loop();

     
   
     if(checkRun){
       if(ReadEncoders(1)){
          MQTT.publish(TOPICO_PUBLISH, "M1R");
           Serial.println("caiu");
        }
      } 
      if(checkRunReverse){
       if(ReadEncoders(1)){
          MQTT.publish(TOPICO_PUBLISH, "M1Re");
        }
      }
      
    if(checkRun2){
     // MQTT.publish(TOPICO_PUBLISH, "M2RT");
       if(ReadEncoders(2)){
          MQTT.publish(TOPICO_PUBLISH, "M2R");
        }
      } 
      if(checkRunReverse2){
       // MQTT.publish(TOPICO_PUBLISH, "M2ReT");
       if(ReadEncoders(2)){
          MQTT.publish(TOPICO_PUBLISH, "M2Re");
        }
      }
   /* buttoncheck = digitalRead(stopper);
    if(buttoncheck == HIGH){
      motorpara(2);
      MQTT.publish(TOPICO_PUBLISH, "SD2");
      }   */
}

void motorfunciona(int ql){
  if(ql == 1){
    digitalWrite(enable, HIGH); 
    digitalWrite(Entrada1, HIGH);   
  }
   //Aciona o motor  

  if(ql == 2){   
    digitalWrite(enable2, HIGH); 
    digitalWrite(Entrada2, HIGH); 
   
  }  
 }
 
void motorpara(int ql){
  if(ql == 1){
    digitalWrite(enable, LOW); 
    digitalWrite(Entrada1, LOW); 
  }
   //Aciona o motor  

  if(ql == 2){
    digitalWrite(enable2, LOW); 
    digitalWrite(Entrada2, LOW);  
  } 
}

void motorreverse(int ql){
  if(ql == 1){
    digitalWrite(enable, HIGH); 
    digitalWrite(Entrada1, LOW);  
  }
   //Aciona o motor  

  if(ql == 2){
    digitalWrite(enable2, HIGH); 
    digitalWrite(Entrada2, LOW);    
  }  
}

 bool ReadEncoders(int n){
    
    if(n == 2){
      
      for(int i = 0; i < 15; i++){
        dataEncoder3 = digitalRead(encoder3);
        dataEncoder4 = digitalRead(encoder4);

        
  
        if(dataEncoder3 == 1 && dataEncoder4 == 1 || dataEncoder3 == 0 && dataEncoder4 == 1 ){
          int lastreading = dataEncoder1;

          dataEncoder3 = digitalRead(encoder3);         
          if(dataEncoder3 != lastreading){
            counter2++;            
         }
        }
      }
      if(counter >= 10){
        return true;
        counter2 = 0;
        }
    }
 
  
    if(n == 1){
      
      for(int i = 0; i < 15; i++){
        dataEncoder1 = digitalRead(encoder1);
        dataEncoder2 = digitalRead(encoder2);
        
        Serial.println("Encoder 1:");
        Serial.println(dataEncoder1);
        Serial.println("Encoder 2:");
        Serial.println(dataEncoder2);
          
        if(dataEncoder1 == 1 && dataEncoder2 == 1 || dataEncoder1 == 0 && dataEncoder2 == 1 ){
          int lastreading = dataEncoder1;

          dataEncoder1 = digitalRead(encoder1);
          
         
          if(dataEncoder1 != lastreading){
            counter++;            
         }
        }
      }
      if(counter >= 10){
        return true;
        counter = 0;
        }
    }
  
 }

 

