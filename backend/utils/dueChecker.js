const { DateTime } = require("luxon");

/**
 * Compare two datetime strings and check if they are more than one calendar month apart.
 * @param {string} dateStr1 - e.g., "2025-04-27 23:48:06"
 * @param {string} dateStr2 - e.g., "2025-05-28 23:48:06"
 * @returns {boolean} true if more than one month apart
 */
function isMoreThanOneMonth(dateStr1, dateStr2) {
  const format = "yyyy-MM-dd HH:mm:ss";

  const dt1 = DateTime.fromFormat(dateStr1, format, { zone: "Asia/Manila" });
  const dt2 = DateTime.fromFormat(dateStr2, format, { zone: "Asia/Manila" });

  if (!dt1.isValid || !dt2.isValid) {
    throw new Error("Invalid date format. Expected 'yyyy-MM-dd HH:mm:ss'");
  }

  const diffInMonths = Math.abs(dt1.diff(dt2, "months").months);

  return diffInMonths > 1;
}

const isMoreThanOneMonthDate = (date1, date2) => {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error("Both parameters must be Date objects.");
  }

  const dt1 = DateTime.fromJSDate(date1).setZone("Asia/Manila").startOf("day");
  const dt2 = DateTime.fromJSDate(date2).setZone("Asia/Manila").startOf("day");

  const diffInMonths = Math.abs(dt1.diff(dt2, "months").months);

  return diffInMonths > 1;
};

module.exports = { isMoreThanOneMonth, isMoreThanOneMonthDate };
