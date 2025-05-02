// #include <Wire.h>
// #include "Adafruit_TCS34725.h"
// #include <DHT.h>

// // Pin definitions
// #define MOISTURE_PIN A0
// #define DHT_PIN 2
// #define LED_PIN 9
// #define DHT_TYPE DHT11

// Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_154MS, TCS34725_GAIN_4X);
// DHT dht(DHT_PIN, DHT_TYPE);

// void setup() {
//   Serial.begin(9600);
//   delay(500);

//   if (tcs.begin()) {
//     Serial.println("TCS34725 initialized");
//   } else {
//     Serial.println("TCS34725 not found");
//     while (1);
//   }

//   dht.begin();
//   pinMode(LED_PIN, OUTPUT);
//   digitalWrite(LED_PIN, HIGH);
// }

// void loop() {
//   uint16_t r, g, b, c;
//   tcs.getRawData(&r, &g, &b, &c);

//   float red = constrain(map(r, 0, c, 0, 255), 0, 255);
//   float green = constrain(map(g, 0, c, 0, 255), 0, 255);
//   float blue = constrain(map(b, 0, c, 0, 255), 0, 255);

//   // int rainfall = analogRead(MOISTURE_PIN);
//   // float rainfall_percent = map(rainfall, 0, 1023, 0, 100);

//   int rainfall = analogRead(MOISTURE_PIN);

//   // Sensor gives Volumetric Water Content directly in % (0–100%)
//   float vwc_percent = map(rainfall, 0, 1023, 0, 100);  // Adjust if your sensor outputs differently

//   // Convert VWC to mm using root zone depth
//   float root_zone_depth_mm = 300;  // e.g., 300mm depth
//   float rainfall_mm = (vwc_percent / 100.0) * root_zone_depth_mm;

//   float humidity = dht.readHumidity();
//   float temperature = dht.readTemperature();

//   if (isnan(humidity) || isnan(temperature)) {
//     Serial.println("DHT error");
//     return;
//   }

//   Serial.print(red);
//   Serial.print(",");
//   Serial.print(green);
//   Serial.print(",");
//   Serial.print(blue);
//   Serial.print(",");
//   Serial.print(rainfall_mm);
//   Serial.print(",");
//   Serial.print(temperature);
//   Serial.print(",");
//   Serial.print(humidity);
//   Serial.println();

//   delay(60000);
// }
#include <Wire.h>
#include <DHT.h>

// Pin definitions
#define MOISTURE_PIN A0
#define PH_PIN A1
#define DHT_PIN 2
#define LED_PIN 9
#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(9600);
  delay(500);

  dht.begin();
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
}

void loop() {
  // ---------- Moisture Sensor ----------
  int moistureRaw = analogRead(MOISTURE_PIN);
  float vwc_percent = map(moistureRaw, 0, 1023, 0, 100);
  float root_zone_depth_mm = 300; // Adjust based on your crop/root
  float rainfall_mm = (vwc_percent / 100.0) * root_zone_depth_mm;

  // ---------- DHT Sensor ----------
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT error");
    return;
  }

  // ---------- pH Sensor ----------
  int phRaw = analogRead(PH_PIN);
  float voltage = phRaw * (5.0 / 1023.0);  // Convert analog value to voltage
  float pH_value = 3.5 * voltage + 0.00;   // Adjust formula with calibration

  // ---------- Serial Print ----------
  Serial.print(rainfall_mm);
  Serial.print(",");
  Serial.print(temperature);
  Serial.print(",");
  Serial.print(humidity);
  Serial.print(",");
  Serial.println(pH_value);


  delay(60000);  // 1-minute delay
}
