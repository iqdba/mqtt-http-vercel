import mqtt from "mqtt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const payload = req.body?.payload || "unknown";
  const topic = req.body?.topic || "mqtt-http-vercel";

  const client = mqtt.connect("mqtt://broker.emqx.io");

  await new Promise((resolve, reject) => {
    client.on("connect", () => {
      client.publish(topic, payload, { qos: 1, retain: true }, (err) => {
        client.end();
        if (err) reject(err);
        else resolve();
      });
    });
    client.on("error", reject);
  });

  res.status(200).json({ status: "published", topic, payload });
}
