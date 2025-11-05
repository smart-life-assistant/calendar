/**
 * Vietnamese Lunar Calendar Library
 * Based on the traditional Vietnamese lunar calendar calculation
 * Supports conversion between solar and lunar dates, Can Chi calculation
 */

const PI = Math.PI;

// Thiên Can (Heavenly Stems)
const THIEN_CAN = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];

// Địa Chi (Earthly Branches)
const DIA_CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tị",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

// Con giáp (Zodiac animals)
const CON_GIAP = [
  "Tý (Chuột)",
  "Sửu (Trâu)",
  "Dần (Hổ)",
  "Mão (Mèo)",
  "Thìn (Rồng)",
  "Tị (Rắn)",
  "Ngọ (Ngựa)",
  "Mùi (Dê)",
  "Thân (Khỉ)",
  "Dậu (Gà)",
  "Tuất (Chó)",
  "Hợi (Lợn)",
];

// Lunar month names in Chinese-Vietnamese
const THANG_AM = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười một",
  "Chạp",
];

// Lunar day names
const NGAY_AM = [
  "Mồng một",
  "Mồng hai",
  "Mồng ba",
  "Mồng bốn",
  "Mồng năm",
  "Mồng sáu",
  "Mồng bảy",
  "Mồng tám",
  "Mồng chín",
  "Mồng mười",
  "Ngày 11",
  "Ngày 12",
  "Ngày 13",
  "Ngày 14",
  "Ngày 15",
  "Ngày 16",
  "Ngày 17",
  "Ngày 18",
  "Ngày 19",
  "Ngày 20",
  "Ngày 21",
  "Ngày 22",
  "Ngày 23",
  "Ngày 24",
  "Ngày 25",
  "Ngày 26",
  "Ngày 27",
  "Ngày 28",
  "Ngày 29",
  "Ngày 30",
];

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  dayName: string;
  monthName: string;
  yearCanChi: string;
  monthCanChi: string;
  dayCanChi: string;
  zodiac: string;
}

/**
 * Compute the Julian Day Number from day, month, year
 */
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Convert Julian Day Number to date
 */
function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);
  return { day, month, year };
}

/**
 * Compute the longitude of the sun at any time
 */
function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL =
    DL +
    (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
    0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * Math.floor(L / (PI * 2));
  return L;
}

/**
 * Compute sun longitude at midnight
 */
function getSunLongitude(dayNumber: number, timeZone: number): number {
  return Math.floor((sunLongitude(dayNumber - 0.5 - timeZone / 24.0) / PI) * 6);
}

/**
 * Find the day that starts the lunar month 11 of the given year
 */
function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Find the index of the leap month after the month starting on the given day
 */
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Compute the day of the k-th new moon in the given time zone
 */
function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 =
    C1 -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M));
  C1 =
    C1 -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 =
    C1 +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat =
      0.001 +
      0.000839 * T +
      0.0002261 * T2 -
      0.00000845 * T3 -
      0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24.0);
}

/**
 * Convert solar date to lunar date
 */
export function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone: number = 7
): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = 1;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  // Calculate Can Chi
  const jdn = jdFromDate(dd, mm, yy);

  // Day Can Chi
  const dayCanIndex = (jdn + 9) % 10;
  const dayChiIndex = (jdn + 1) % 12;
  const dayCanChi = THIEN_CAN[dayCanIndex] + " " + DIA_CHI[dayChiIndex];

  // Year Can Chi
  const yearCanIndex = (lunarYear + 6) % 10;
  const yearChiIndex = (lunarYear + 8) % 12;
  const yearCanChi = THIEN_CAN[yearCanIndex] + " " + DIA_CHI[yearChiIndex];

  // Month Can Chi (simplified calculation)
  const monthCanIndex = (lunarYear * 12 + lunarMonth + 3) % 10;
  const monthChiIndex = (lunarMonth + 1) % 12;
  const monthCanChi = THIEN_CAN[monthCanIndex] + " " + DIA_CHI[monthChiIndex];

  // Get names
  const dayName = NGAY_AM[lunarDay - 1] || `Ngày ${lunarDay}`;
  const monthName =
    (lunarLeap ? "Nhuận " : "") + "Tháng " + THANG_AM[lunarMonth - 1];
  const zodiac = CON_GIAP[yearChiIndex];

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth: lunarLeap === 1,
    dayName,
    monthName,
    yearCanChi,
    monthCanChi,
    dayCanChi,
    zodiac,
  };
}

/**
 * Convert lunar date to solar date
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean = false,
  timeZone: number = 7
): { day: number; month: number; year: number } {
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (isLeapMonth && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 };
    } else if (isLeapMonth || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Get Can Chi for a specific date
 */
export function getCanChi(
  dd: number,
  mm: number,
  yy: number
): {
  day: string;
  month: string;
  year: string;
} {
  const lunar = convertSolar2Lunar(dd, mm, yy);
  return {
    day: lunar.dayCanChi,
    month: lunar.monthCanChi,
    year: lunar.yearCanChi,
  };
}

/**
 * Check if a lunar year has leap month
 * Returns the leap month number (1-12) or 0 if no leap month
 */
export function hasLeapMonth(lunarYear: number, timeZone: number = 7): number {
  const a11 = getLunarMonth11(lunarYear - 1, timeZone);
  const b11 = getLunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    return getLeapMonthOffset(a11, timeZone) - 2;
  }
  return 0;
}

/**
 * Get zodiac animal for a lunar year
 */
export function getZodiac(lunarYear: number): string {
  return CON_GIAP[(lunarYear + 8) % 12];
}

/**
 * Format lunar date to Vietnamese string
 */
export function formatLunarDate(lunar: LunarDate): string {
  return `${lunar.dayName} ${lunar.monthName} năm ${lunar.yearCanChi}`;
}

/**
 * Get number of days in a lunar month
 * Returns 29 or 30 days
 */
export function getLunarMonthDays(
  lunarMonth: number,
  lunarYear: number,
  timeZone: number = 7
): number {
  // Get the Julian day number for the 1st day of this month
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  // Check if there's a leap month
  let leapMonth = -1;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
  }

  // Get the new moon of this month and next month
  let nm = getNewMoonDay(k + off, timeZone);
  let nmNext;

  if (leapMonth >= 0 && off === leapMonth) {
    // This is a leap month, next month is the regular month
    nmNext = getNewMoonDay(k + off + 1, timeZone);
  } else if (leapMonth >= 0 && off === leapMonth - 1) {
    // Next month is the leap month
    nmNext = getNewMoonDay(k + off + 2, timeZone);
  } else {
    // Normal case
    nmNext = getNewMoonDay(k + off + 1, timeZone);
  }

  // Number of days in this lunar month
  return Math.floor(nmNext - nm);
}

/**
 * Check if a solar year is leap year
 */
export function isSolarLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get number of days in a solar month
 * Handles leap year for February
 */
export function getSolarMonthDays(month: number, year?: number): number {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  // February
  if (year) {
    return isSolarLeapYear(year) ? 29 : 28;
  }
  return 29; // Default when no year selected
}

/**
 * Get Can Chi string for a year
 * Returns formatted string like "Giáp Tý (Chuột)"
 */
export function getYearCanChiString(year: number): string {
  const can = THIEN_CAN[(year + 6) % 10];
  const chi = DIA_CHI[(year + 8) % 12];
  const giap = CON_GIAP[(year + 8) % 12];

  // format giap from Tý (Chuột) to Con Chuột
  const get2 = giap.split(" ")[1].replace("(", "").replace(")", "").trim();
  const formattedGiap = "Con " + get2;

  return `${can} ${chi} (${formattedGiap})`;
}
