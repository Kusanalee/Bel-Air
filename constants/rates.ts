import { RateConfig, VehicleType } from '../types';
// Fix: Corrected import path for TripType, which was pointing to a non-existent file.
import { TripType } from '../types';


export const OUT_OF_TOWN_DAY_TOUR_DESTINATIONS = [
  "BULACAN (WHOLE DAY)", "SAN MIGUEL / BIAK NA BATO",
  "LAKE ISLAND RESORT", "DARANAK FALLS", "BARAS / TANAY / PILILIA",
  "TAGAYTAY / ROSARIO", "PUERTO AZUL / TERNATE", "CAYLABNE",
  "LOS BAÑOS/CALAMBA/CABUYAO/BIÑAN/CANLUBANG", "MACBAN / MAKILING / ALAMINOS", "HIDDEN VALLEY/SAN PABLO/RIZAL/STA.CRUZ/CALAUAN", "PAGSANJAN / VILLA ESCUDERO / LILIW / BAY",
  "LAGUNA LOOP",
  "BATULAO / TALISAY / LIAN / CUENCA /LAUREL", "CANYON WOODS / LIPA / STO. TOMAS / MATAAS NA KAHOY", "NASUGBU / MATABUNGKAY / TAAL", "CALATAGAN / SAN JUAN / LAIA / LEMERY",
  "ANGELES CITY / FONTANA", "CLARK CITY TOUR",
  "OLONGAPO / SUBIC", "SAN NARCISO / SAN ANTONIO",
];

export const MULTI_DAY_OVERNIGHT_DESTINATIONS = [
  "UNISAN", "CALAUAG", "BALER", "BAGUIO TOUR", "BANAUE",
  "BAGUIO/HUNDREDISLAND", "BAGUIO/LU/BAGUIO", "LAOAG", "PAGUDPOD",
  "VIGAN", "NALINAC", "BAUANG / SAN FERNANDO", "BOLINAO", "HUNDRED ISLAND / ALAMINOS / LINGAYEN/SUAL",
  "NAGA/PILI", "LEGASPI / CARAMOAN", "CAPALONGA", "SORSOGON"
];


export const RATE_CONFIG: RateConfig = {
  provinces: [
    {
      name: "METRO MANILA",
      destinations: [
        { name: TripType.CITY_TRANSFER, kms: 25, time: 3, rates: { [VehicleType.BUS]: 8180, [VehicleType.VAN]: 1640 } },
        { name: TripType.CITY_TOUR, kms: 45, time: 5, rates: { [VehicleType.BUS]: 12100, [VehicleType.VAN]: 3820 } },
        { name: "DINNER TOUR", kms: 45, time: 3, rates: { [VehicleType.BUS]: 8580, [VehicleType.VAN]: 4210 } },
        { name: TripType.WHOLE_DAY_METRO, kms: 100, time: 10, rates: { [VehicleType.BUS]: 19560, [VehicleType.VAN]: 9200 } },
      ],
    },
    {
      name: "BULACAN",
      destinations: [
        { name: "BULACAN (WHOLE DAY)", time: 10, rates: { [VehicleType.BUS]: 21520, [VehicleType.VAN]: 11040 } },
        { name: "SAN MIGUEL / BIAK NA BATO", kms: 152, time: 10, rates: { [VehicleType.BUS]: 28458, [VehicleType.VAN]: 11803 } },
      ],
    },
    {
        name: "RIZAL",
        destinations: [
            { name: "LAKE ISLAND RESORT", kms: 152, time: 10, rates: { [VehicleType.BUS]: 21520, [VehicleType.VAN]: 11040 } },
            { name: "DARANAK FALLS", kms: 187, time: 10, rates: { [VehicleType.BUS]: 21520, [VehicleType.VAN]: 11040 } },
            { name: "BARAS / TANAY / PILILIA", kms: 174, time: 10, rates: { [VehicleType.BUS]: 21520, [VehicleType.VAN]: 12660 } },
        ]
    },
    {
        name: "CAVITE",
        destinations: [
            { name: "TAGAYTAY / ROSARIO", kms: 193, time: 10, rates: { [VehicleType.BUS]: 22370, [VehicleType.VAN]: 11440 } },
            { name: "PUERTO AZUL / TERNATE", kms: 185, time: 10, rates: { [VehicleType.BUS]: 22810, [VehicleType.VAN]: 11200 } },
            { name: "CAYLABNE", kms: 194, time: 10, rates: { [VehicleType.BUS]: 24060, [VehicleType.VAN]: 13290 } },
        ]
    },
    {
        name: "LAGUNA",
        destinations: [
            { name: "LOS BAÑOS/CALAMBA/CABUYAO/BIÑAN/CANLUBANG", kms: 130, time: 10, rates: { [VehicleType.BUS]: 22370, [VehicleType.VAN]: 11440 } },
            { name: "MACBAN / MAKILING / ALAMINOS", kms: 190, time: 10, rates: { [VehicleType.BUS]: 22810, [VehicleType.VAN]: 12680 } },
            { name: "HIDDEN VALLEY/SAN PABLO/RIZAL/STA.CRUZ/CALAUAN", kms: 190, time: 10, rates: { [VehicleType.BUS]: 23950, [VehicleType.VAN]: 12230 } },
            { name: "PAGSANJAN / VILLA ESCUDERO / LILIW / BAY", kms: 210, time: 10, rates: { [VehicleType.BUS]: 24060, [VehicleType.VAN]: 12770 } },
            { name: "LAGUNA LOOP", kms: 270, time: 10, rates: { [VehicleType.BUS]: 31080, [VehicleType.VAN]: 15800 } },
        ]
    },
    {
        name: "BATANGAS",
        destinations: [
            { name: "BATULAO / TALISAY / LIAN / CUENCA /LAUREL", kms: 200, time: 12, rates: { [VehicleType.BUS]: 21860, [VehicleType.VAN]: 12240 } },
            { name: "CANYON WOODS / LIPA / STO. TOMAS / MATAAS NA KAHOY", kms: 230, time: 12, rates: { [VehicleType.BUS]: 22530, [VehicleType.VAN]: 12240 } },
            { name: "NASUGBU / MATABUNGKAY / TAAL", kms: 230, time: 12, rates: { [VehicleType.BUS]: 25760, [VehicleType.VAN]: 12240 } },
            { name: "CALATAGAN / SAN JUAN / LAIA / LEMERY", kms: 270, time: 12, rates: { [VehicleType.BUS]: 28980, [VehicleType.VAN]: 14520 } },
        ]
    },
    {
        name: "PAMPANGA",
        destinations: [
            { name: "ANGELES CITY / FONTANA", kms: 169, time: 10, rates: { [VehicleType.BUS]: 22040, [VehicleType.VAN]: 11590 } },
            { name: "CLARK CITY TOUR", kms: 190, time: 10, rates: { [VehicleType.BUS]: 23000, [VehicleType.VAN]: 12090 } },
        ]
    },
    {
        name: "ZAMBALES",
        destinations: [
            { name: "OLONGAPO / SUBIC", kms: 270, time: 12, rates: { [VehicleType.BUS]: 33990, [VehicleType.VAN]: 17290 } },
            { name: "SAN NARCISO / SAN ANTONIO", kms: 340, time: 14, rates: { [VehicleType.BUS]: 33600, [VehicleType.VAN]: 20470 } },
        ]
    },
    {
        name: "MOUNTAIN PROVINCE",
        destinations: [
            { name: "BAGUIO TOUR", time: 36, rates: { [VehicleType.BUS]: 71040, [VehicleType.VAN]: 40090 } },
            { name: "BANAUE", time: 36, rates: { [VehicleType.BUS]: 81970, [VehicleType.VAN]: 46580 } },
            { name: "BAGUIO/HUNDREDISLAND", time: 36, rates: { [VehicleType.BUS]: 81970, [VehicleType.VAN]: 38650 } },
            { name: "BAGUIO/LU/BAGUIO", time: 36, rates: { [VehicleType.BUS]: 81970, [VehicleType.VAN]: 38650 } },
        ]
    },
    {
        name: "ILOCOS NORTE",
        destinations: [
            { name: "LAOAG", time: 36, rates: { [VehicleType.BUS]: 103030, [VehicleType.VAN]: 55140 } },
            { name: "PAGUDPOD", time: 36, rates: { [VehicleType.BUS]: 117530, [VehicleType.VAN]: 59660 } },
        ]
    },
    {
        name: "ILOCOS SUR",
        destinations: [
            { name: "VIGAN", time: 36, rates: { [VehicleType.BUS]: 90400, [VehicleType.VAN]: 50400 } },
        ]
    },
    {
        name: "LA UNION",
        destinations: [
             { name: "NALINAC", time: 36, rates: { [VehicleType.BUS]: 61700, [VehicleType.VAN]: 35300 } },
             { name: "BAUANG / SAN FERNANDO", time: 36, rates: { [VehicleType.BUS]: 61700, [VehicleType.VAN]: 35300 } },
        ]
    },
    {
        name: "PANGASINAN",
        destinations: [
            { name: "BOLINAO", time: 36, rates: { [VehicleType.BUS]: 64010, [VehicleType.VAN]: 35930 } },
            { name: "HUNDRED ISLAND / ALAMINOS / LINGAYEN/SUAL", time: 36, rates: { [VehicleType.BUS]: 57950, [VehicleType.VAN]: 35300 } },
        ]
    },
    {
        name: "BICOL REGION",
        destinations: [
            { name: "NAGA/PILI", time: 36, rates: { [VehicleType.BUS]: 91120, [VehicleType.VAN]: 45630 } },
            { name: "LEGASPI / CARAMOAN", time: 36, rates: { [VehicleType.BUS]: 112630, [VehicleType.VAN]: 56410 } },
            { name: "CAPALONGA", time: 36, rates: { [VehicleType.BUS]: 114140, [VehicleType.VAN]: 57180 } },
            { name: "SORSOGON", time: 36, rates: { [VehicleType.BUS]: 117530, [VehicleType.VAN]: 59660 } },
        ]
    },
     {
        name: "QUEZON",
        destinations: [
            { name: "UNISAN", time: 36, rates: { [VehicleType.BUS]: 48140, [VehicleType.VAN]: 26840 } },
            { name: "CALAUAG", time: 36, rates: { [VehicleType.BUS]: 51300, [VehicleType.VAN]: 28600 } },
        ]
    },
    {
      name: "AURORA",
      destinations: [
        { name: "BALER", time: 36, rates: { [VehicleType.BUS]: 71040, [VehicleType.VAN]: 40090 } },
      ]
    }
  ],
  belAirRates: {
    metroManila: {
      [VehicleType.BUS]: { baseRate: 16000, baseHours: 10, excessHourRate: 1500 },
      [VehicleType.VAN]: { baseRate: 7000, baseHours: 10, excessHourRate: 800 },
    },
  },
  outsidePattoRates: {
    [VehicleType.BUS]: { perKm: 128 },
    [VehicleType.VAN]: { perKm: 72 },
  },
  extraDayRates: {
    [VehicleType.BUS]: 22010,
    [VehicleType.VAN]: 9200,
  },
  vehicleDetails: {
      [VehicleType.BUS]: { capacity: '49-55 Seater' },
      [VehicleType.VAN]: { capacity: '10-14 Seater' },
  },
  vehicleInventory: {
    [VehicleType.BUS]: 50,
    [VehicleType.VAN]: 5,
  },
  sampleBookings: [
    { vehicleType: VehicleType.BUS, quantity: 48, startDate: '2024-12-24T08:00', endDate: '2024-12-26T20:00' },
    { vehicleType: VehicleType.VAN, quantity: 4, startDate: '2024-12-31T06:00', endDate: '2025-01-01T23:00' },
  ],
  contactInfo: {
    phone: ['0917-800-0425', '(02) 8853-4444', '(02) 8853-5555'],
    email: 'inquire@belairbuscharter.com',
    companyEmail: 'admin@belaircharter.example.com',
  },
  finePrint: {
    inclusions: [
      'Driver’s fee',
      'Fuel',
      'Standard toll fee (regular tollways included as per agreed route)',
    ],
    exclusions: [
      { text: 'Skyway toll fees' },
      { text: 'Bus permit / entry pass' },
      { text: 'Parking fees' },
      { text: 'Excess hours', dynamic: 'excessHours' },
    ],
  },
  paymentTerms: [
    '50% down payment is required upon confirmation of booking. This may be settled via bank deposit or bank transfer.',
    'The remaining 50% balance is payable on the day of the trip in cash.',
    'If paying by check, it must be deposited and cleared at least 7 days before the trip.',
    'We accept cash, checks, or bank transfers. No online card payment is processed through this system.',
  ],
  seasonalDiscounts: {
    lean: {
      months: [8], // August
      maxDiscount: 0.30
    },
    peak: {
      months: [10, 11], // October, November
      maxDiscount: 0.20
    },
    regular: {
      maxDiscount: 0
    }
  },
};
