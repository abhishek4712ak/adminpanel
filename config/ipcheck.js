import ipSchema from "../models/ip.model.js";

const getIp = async (req, res) => {
  try {
    const ip = await ipSchema.find({});
    return ip;
  } catch (err) {
    return err;
  }
};

const allowedIps = getIp;

const allowed = ["127.0.0.1","192.168.56.1"];

allowedIps((data) => {
  data.forEach((elem) => {
    allowed.push(elem["ipAddress"]);
  });
});

const restrictedIP = async (req, res, next) => {
  let clientIP = req.ip || req.connection.remoteAddress;
  // Normalize IPv4-mapped IPv6 addresses
  if (clientIP && clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.replace('::ffff:', '');
  }
  if (clientIP === '::1') {
    clientIP = '127.0.0.1';
  }

  console.log(clientIP);
  if (allowed.includes(clientIP)) {
    console.log("allowed Ips:",allowed)
    next();
  } else {
    res.render("restrictedIp");
  }
};

export default restrictedIP;
