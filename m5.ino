#include <M5StickCPlus.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "";
const char *password = "";

// https://modalsoul.hatenablog.com/entry/2021/01/08/070000

void setup()
{
  M5.begin();
  CleanScreen();
  M5.Lcd.print("Connecting to ");
  M5.Lcd.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    M5.Lcd.print(".");
  }
  M5.Lcd.println("");
  M5.Lcd.println("WiFi connected");
  M5.Lcd.println("IP address: ");
  M5.Lcd.println(WiFi.localIP());
  delay(2000);
}

void loop()
{
  M5.update();

  if (M5.BtnA.wasPressed())
  {
    HTTPClient http;
    char *url = "https://tennis.deno.dev";
    M5.Lcd.println("START GET");
    http.begin("https://tennis.deno.dev/add/0");
    http.GET();
    http.end();
    M5.Lcd.println("END GET");
    delay(100);
  }
  else if (M5.BtnB.wasPressed())
  {
    HTTPClient http;
    char *url = "https://tennis.deno.dev";
    M5.Lcd.println("START GET");
    http.begin("https://tennis.deno.dev/add/1");
    http.GET();
    http.end();
    M5.Lcd.println("END GET");
    delay(100);
  }
}

void CleanScreen()
{
  M5.Lcd.fillRect(0, 0, 80, 160, BLACK);
  M5.Lcd.setTextFont(1);
  M5.Lcd.setCursor(0, 0, 2);
  M5.Lcd.println(("WiFi Test"));
  M5.Lcd.setCursor(0, 20);
}