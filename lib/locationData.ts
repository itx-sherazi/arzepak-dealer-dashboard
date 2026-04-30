export interface AreaItem {
  name: string;
  lat: number;
  lng: number;
}

export interface CityData {
  name: string;
  lat: number;
  lng: number;
  areas: AreaItem[];
}

export const CITY_DATA: CityData[] = [
  {
    name: "Lahore", lat: 31.5204, lng: 74.3587,
    areas: [
      { name: "DHA Phase 1", lat: 31.4697, lng: 74.3823 },
      { name: "DHA Phase 2", lat: 31.4611, lng: 74.3939 },
      { name: "DHA Phase 3", lat: 31.4533, lng: 74.4028 },
      { name: "DHA Phase 4", lat: 31.4434, lng: 74.4133 },
      { name: "DHA Phase 5", lat: 31.4359, lng: 74.4231 },
      { name: "DHA Phase 6", lat: 31.4208, lng: 74.4325 },
      { name: "Bahria Town", lat: 31.3644, lng: 74.1726 },
      { name: "Gulberg", lat: 31.5089, lng: 74.3451 },
      { name: "Model Town", lat: 31.4830, lng: 74.3213 },
      { name: "Garden Town", lat: 31.5044, lng: 74.3270 },
      { name: "Johar Town", lat: 31.4697, lng: 74.2728 },
      { name: "Iqbal Town", lat: 31.4864, lng: 74.3003 },
      { name: "Wapda Town", lat: 31.4558, lng: 74.2500 },
      { name: "Cantt", lat: 31.5359, lng: 74.4011 },
      { name: "Shadman", lat: 31.5258, lng: 74.3319 },
      { name: "Samanabad", lat: 31.5058, lng: 74.3047 },
      { name: "Faisal Town", lat: 31.4919, lng: 74.3128 },
      { name: "Township", lat: 31.4658, lng: 74.2928 },
      { name: "Allama Iqbal Town", lat: 31.4864, lng: 74.3003 },
      { name: "LDA Avenue", lat: 31.3908, lng: 74.1958 },
      { name: "Raiwind Road", lat: 31.4039, lng: 74.3208 },
      { name: "Bedian Road", lat: 31.4247, lng: 74.4358 },
      { name: "Thokar Niaz Baig", lat: 31.4047, lng: 74.2728 },
      { name: "Valencia Town", lat: 31.5597, lng: 74.4428 },
      { name: "Green City", lat: 31.3728, lng: 74.2028 },
      { name: "PCSIR", lat: 31.4736, lng: 74.3047 },
      { name: "Sui Gas Society", lat: 31.4625, lng: 74.3208 },
    ],
  },
  {
    name: "Karachi", lat: 24.8607, lng: 67.0011,
    areas: [
      { name: "DHA Phase 1", lat: 24.8219, lng: 67.0575 },
      { name: "DHA Phase 2", lat: 24.8044, lng: 67.0717 },
      { name: "DHA Phase 5", lat: 24.7967, lng: 67.0831 },
      { name: "DHA Phase 6", lat: 24.7789, lng: 67.0928 },
      { name: "DHA Phase 7", lat: 24.7592, lng: 67.1047 },
      { name: "DHA Phase 8", lat: 24.7394, lng: 67.1158 },
      { name: "Clifton", lat: 24.8075, lng: 67.0267 },
      { name: "Gulshan-e-Iqbal", lat: 24.9225, lng: 67.0978 },
      { name: "PECHS", lat: 24.8728, lng: 67.0594 },
      { name: "North Nazimabad", lat: 24.9511, lng: 67.0361 },
      { name: "Gulistan-e-Johar", lat: 24.9242, lng: 67.1283 },
      { name: "Bahria Town Karachi", lat: 24.8647, lng: 66.9564 },
      { name: "Scheme 33", lat: 24.9628, lng: 67.1633 },
      { name: "Malir", lat: 24.8958, lng: 67.2128 },
      { name: "Korangi", lat: 24.8372, lng: 67.1261 },
      { name: "Landhi", lat: 24.8603, lng: 67.1861 },
      { name: "Shah Faisal Colony", lat: 24.8769, lng: 67.1472 },
      { name: "Saadi Town", lat: 24.9736, lng: 67.1239 },
      { name: "Federal B Area", lat: 24.9389, lng: 67.0617 },
      { name: "Surjani Town", lat: 25.0233, lng: 67.0394 },
    ],
  },
  {
    name: "Islamabad", lat: 33.6844, lng: 73.0479,
    areas: [
      { name: "F-6", lat: 33.7294, lng: 73.0861 },
      { name: "F-7", lat: 33.7211, lng: 73.0703 },
      { name: "F-8", lat: 33.7119, lng: 73.0558 },
      { name: "F-10", lat: 33.6997, lng: 73.0344 },
      { name: "F-11", lat: 33.6936, lng: 73.0136 },
      { name: "G-6", lat: 33.7186, lng: 73.0894 },
      { name: "G-7", lat: 33.7103, lng: 73.0736 },
      { name: "G-8", lat: 33.7011, lng: 73.0583 },
      { name: "G-9", lat: 33.6936, lng: 73.0436 },
      { name: "G-10", lat: 33.6861, lng: 73.0281 },
      { name: "G-11", lat: 33.6783, lng: 73.0119 },
      { name: "G-13", lat: 33.6664, lng: 72.9875 },
      { name: "DHA Islamabad", lat: 33.5761, lng: 72.9958 },
      { name: "Bahria Town Ph 1-6", lat: 33.5639, lng: 73.0739 },
      { name: "Bahria Town Ph 7", lat: 33.5575, lng: 73.0969 },
      { name: "E-7", lat: 33.7244, lng: 73.1061 },
      { name: "E-11", lat: 33.7136, lng: 72.9939 },
      { name: "I-8", lat: 33.6986, lng: 73.0736 },
      { name: "I-10", lat: 33.6828, lng: 73.0736 },
      { name: "Pwd Colony", lat: 33.6428, lng: 73.0958 },
      { name: "Bhara Kahu", lat: 33.6697, lng: 73.2156 },
      { name: "Bani Gala", lat: 33.6919, lng: 73.1358 },
    ],
  },
  {
    name: "Rawalpindi", lat: 33.5651, lng: 73.0169,
    areas: [
      { name: "Bahria Town", lat: 33.5275, lng: 73.1469 },
      { name: "DHA", lat: 33.5522, lng: 73.1103 },
      { name: "Gulraiz", lat: 33.5947, lng: 73.0644 },
      { name: "Satellite Town", lat: 33.5808, lng: 73.0403 },
      { name: "Chaklala Scheme 3", lat: 33.5975, lng: 73.0969 },
      { name: "Askari 14", lat: 33.5672, lng: 73.1269 },
      { name: "Pwd", lat: 33.5294, lng: 73.0786 },
      { name: "Soan Garden", lat: 33.5369, lng: 73.0858 },
      { name: "Wah Cantt", lat: 33.7667, lng: 72.7583 },
      { name: "Media Town", lat: 33.5753, lng: 73.0228 },
      { name: "Gulshan Abad", lat: 33.5653, lng: 72.9936 },
      { name: "Race Course Road", lat: 33.5794, lng: 73.0561 },
    ],
  },
  {
    name: "Faisalabad", lat: 31.4181, lng: 73.0797,
    areas: [
      { name: "Canal Road", lat: 31.4286, lng: 73.1014 },
      { name: "Jinnah Colony", lat: 31.4408, lng: 73.0742 },
      { name: "Peoples Colony", lat: 31.4497, lng: 73.0964 },
      { name: "Ghulam Muhammad Abad", lat: 31.4033, lng: 73.1153 },
      { name: "Kohinoor City", lat: 31.3994, lng: 73.1358 },
      { name: "Millat Town", lat: 31.4653, lng: 73.1253 },
      { name: "Gulshan Colony", lat: 31.4339, lng: 73.0525 },
      { name: "Eden Valley", lat: 31.3894, lng: 73.1525 },
    ],
  },
  {
    name: "Multan", lat: 30.1575, lng: 71.5249,
    areas: [
      { name: "DHA Multan", lat: 30.1189, lng: 71.4933 },
      { name: "Bahria Town Multan", lat: 30.0711, lng: 71.5303 },
      { name: "Cantt", lat: 30.1961, lng: 71.5478 },
      { name: "Shah Rukn-e-Alam", lat: 30.1994, lng: 71.4769 },
      { name: "Gulgasht Colony", lat: 30.1869, lng: 71.5153 },
      { name: "Bosan Road", lat: 30.1439, lng: 71.4972 },
    ],
  },
  {
    name: "Peshawar", lat: 34.0151, lng: 71.5249,
    areas: [
      { name: "Hayatabad", lat: 33.9967, lng: 71.4667 },
      { name: "Bahria Town Peshawar", lat: 33.9842, lng: 71.4314 },
      { name: "University Town", lat: 34.0094, lng: 71.4972 },
      { name: "Cantt", lat: 34.0261, lng: 71.5408 },
      { name: "Phase 5 Gulbahar", lat: 34.0461, lng: 71.5597 },
    ],
  },
  {
    name: "Quetta", lat: 30.1798, lng: 66.9750,
    areas: [
      { name: "Cantt", lat: 30.1919, lng: 67.0036 },
      { name: "Jinnah Town", lat: 30.1978, lng: 66.9894 },
      { name: "Satellite Town", lat: 30.1708, lng: 66.9650 },
      { name: "Sariab Road", lat: 30.1375, lng: 66.9419 },
    ],
  },
  {
    name: "Gujranwala", lat: 32.1877, lng: 74.1945,
    areas: [
      { name: "DHA Gujranwala", lat: 32.1703, lng: 74.2311 },
      { name: "Satellite Town", lat: 32.2111, lng: 74.2028 },
      { name: "Green Town", lat: 32.1947, lng: 74.1783 },
      { name: "Gulshan Colony", lat: 32.2036, lng: 74.1875 },
    ],
  },
  {
    name: "Sialkot", lat: 32.4945, lng: 74.5229,
    areas: [
      { name: "Cantt", lat: 32.5178, lng: 74.5386 },
      { name: "Iqbal Town", lat: 32.5022, lng: 74.5097 },
      { name: "Gulshan Colony", lat: 32.4858, lng: 74.5136 },
    ],
  },
  {
    name: "Abbottabad", lat: 34.1463, lng: 73.2117,
    areas: [
      { name: "Cantt", lat: 34.1561, lng: 73.2297 },
      { name: "Garden Colony", lat: 34.1636, lng: 73.2053 },
      { name: "Shimla Hill", lat: 34.1508, lng: 73.2186 },
    ],
  },
  {
    name: "Bahawalpur", lat: 29.3956, lng: 71.6836,
    areas: [
      { name: "Model Town A", lat: 29.4069, lng: 71.6783 },
      { name: "Satellite Town", lat: 29.3847, lng: 71.7011 },
      { name: "Cantt", lat: 29.3794, lng: 71.6589 },
    ],
  },
  {
    name: "Hyderabad", lat: 25.3960, lng: 68.3578,
    areas: [
      { name: "Latifabad", lat: 25.4306, lng: 68.3317 },
      { name: "Qasimabad", lat: 25.3775, lng: 68.3747 },
      { name: "Cantt", lat: 25.3781, lng: 68.3419 },
    ],
  },
];

export const ALL_CITIES = CITY_DATA.map(c => c.name);

export function getCityData(city: string): CityData | undefined {
  return CITY_DATA.find(c => c.name.toLowerCase() === city.toLowerCase());
}

export function getAreas(city: string): AreaItem[] {
  return getCityData(city)?.areas ?? [];
}

export function getCityCoords(city: string): [number, number] {
  const c = getCityData(city);
  return c ? [c.lat, c.lng] : [31.5204, 74.3587];
}

export function getAreaCoords(city: string, area: string): [number, number] | null {
  const c = getCityData(city);
  if (!c) return null;
  const a = c.areas.find(x => x.name.toLowerCase() === area.toLowerCase());
  return a ? [a.lat, a.lng] : null;
}
