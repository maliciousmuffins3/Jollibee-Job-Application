const { DateTime } = require("luxon");

const getPhTimeDate = () => {
  const phtNow = DateTime.now().setZone("Asia/Manila");
  //   return phtNow.toString(); // Full ISO string
  return phtNow.toFormat("yyyy-MM-dd HH:mm:ss"); // Pretty format
};

const getPhDate = () => {
  const phtNow = DateTime.now().setZone("Asia/Manila").startOf("day");
  return new Date(phtNow.toISODate()); // only date, no time
};

const convertToPhTime = (isoString) => {
  const phtTime = DateTime.fromISO(isoString, { zone: "utc" }).setZone(
    "Asia/Manila"
  );
  return phtTime.toFormat("yyyy-MM-dd HH:mm:ss");
};

module.exports = { getPhTimeDate, getPhDate, convertToPhTime};
