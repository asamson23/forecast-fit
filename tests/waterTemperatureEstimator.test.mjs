import test from 'node:test';
import assert from 'node:assert/strict';
import { estimatePseudoWaterTemperature } from '../.tmp-water-tests/src/features/weather/waterTemperatureEstimator.js';

function buildDaily(days) {
  return days.map((day, index) => ({
    date: `2026-05-${String(index + 1).padStart(2, '0')}`,
    tMin: day.low,
    tMax: day.high
  }));
}

function buildHourlyWind(values, startDate = '2026-05-07T00:00') {
  const start = new Date(startDate);
  return values.map((wind, index) => ({
    time: new Date(start.getTime() + (index * 3600 * 1000)).toISOString(),
    wind
  }));
}

const manualLake = { waterBodyType: 'deep_lake', windExposure: 'neutral' };

test('returns unavailable when recent lows/highs are missing', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-05-02T12:00',
    latitude: 46,
    daily: buildDaily([{ low: 5, high: null }, { low: null, high: 10 }]),
    hourly: buildHourlyWind([10, 12, 14, 11])
  }, manualLake);

  assert.equal(result.available, false);
  assert.equal(result.confidence, 'unknown');
});

test('keeps a cold spring estimate conservative at Quebec-like latitude', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-05-07T12:00',
    latitude: 47,
    daily: buildDaily([
      { low: 3, high: 10 },
      { low: 4, high: 12 },
      { low: 5, high: 13 },
      { low: 6, high: 15 },
      { low: 7, high: 16 },
      { low: 8, high: 17 },
      { low: 8, high: 18 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(14))
  }, { waterBodyType: 'deep_lake', windExposure: 'offshore' });

  assert.equal(result.available, true);
  assert.ok(result.conservativeTemp <= 12);
});

test('warm summer shallow lake gets a warmer estimate and summer floor', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-07-07T12:00',
    latitude: 43,
    daily: buildDaily([
      { low: 16, high: 27 },
      { low: 17, high: 28 },
      { low: 17, high: 29 },
      { low: 18, high: 30 },
      { low: 18, high: 31 },
      { low: 19, high: 30 },
      { low: 19, high: 29 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(11))
  }, { waterBodyType: 'shallow_lake', windExposure: 'neutral' });

  assert.equal(result.available, true);
  assert.ok(result.temp >= 18);
  assert.ok(result.conservativeTemp >= 15);
});

test('deep lake in spring resists a short warm spike', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-05-07T12:00',
    latitude: 45,
    daily: buildDaily([
      { low: 2, high: 9 },
      { low: 3, high: 11 },
      { low: 4, high: 13 },
      { low: 5, high: 15 },
      { low: 8, high: 22 },
      { low: 11, high: 26 },
      { low: 12, high: 28 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(12))
  }, { waterBodyType: 'deep_lake', windExposure: 'neutral' });

  assert.ok(result.temp <= 17);
});

test('deep autumn water cools more slowly than shallow water', () => {
  const payload = {
    currentTime: '2026-10-20T12:00',
    latitude: 45,
    daily: buildDaily([
      { low: 14, high: 22 },
      { low: 13, high: 21 },
      { low: 12, high: 19 },
      { low: 11, high: 18 },
      { low: 10, high: 16 },
      { low: 9, high: 15 },
      { low: 8, high: 14 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(10))
  };

  const deep = estimatePseudoWaterTemperature(payload, { waterBodyType: 'deep_lake', windExposure: 'neutral' });
  const shallow = estimatePseudoWaterTemperature(payload, { waterBodyType: 'shallow_lake', windExposure: 'neutral' });
  assert.ok(deep.temp >= shallow.temp);
});

test('strong offshore wind cools, but stays capped', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-07-07T12:00',
    latitude: 44,
    daily: buildDaily([
      { low: 14, high: 25 },
      { low: 15, high: 26 },
      { low: 16, high: 27 },
      { low: 16, high: 28 },
      { low: 17, high: 29 },
      { low: 17, high: 29 },
      { low: 18, high: 30 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(40))
  }, { waterBodyType: 'coastal', windExposure: 'offshore' });

  assert.ok(result.debug.offshoreCoolingPenalty <= 6);
});

test('strong onshore wind warms slightly within the capped max', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-07-07T12:00',
    latitude: 44,
    daily: buildDaily([
      { low: 14, high: 25 },
      { low: 15, high: 26 },
      { low: 16, high: 27 },
      { low: 16, high: 28 },
      { low: 17, high: 29 },
      { low: 17, high: 29 },
      { low: 18, high: 30 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(40))
  }, { waterBodyType: 'bay', windExposure: 'onshore' });

  assert.ok(result.debug.onshorePushBonus <= 3 * 1.25);
  assert.ok(result.temp >= result.conservativeTemp);
});

test('auto settings keep confidence low and uncertainty wider', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-06-07T12:00',
    latitude: 43,
    daily: buildDaily([
      { low: 10, high: 20 },
      { low: 11, high: 21 },
      { low: 12, high: 22 },
      { low: 12, high: 23 },
      { low: 13, high: 24 },
      { low: 13, high: 24 },
      { low: 14, high: 25 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(14))
  }, { waterBodyType: 'auto', windExposure: 'auto' });

  assert.equal(result.confidence, 'low');
  assert.ok(result.rangeHigh - result.rangeLow >= 5);
});

test('manual settings keep the fallback spread closer to the older conservative range', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-06-07T12:00',
    latitude: 44,
    daily: buildDaily([
      { low: 10, high: 20 },
      { low: 11, high: 21 },
      { low: 12, high: 22 },
      { low: 12, high: 23 },
      { low: 13, high: 24 },
      { low: 13, high: 24 },
      { low: 14, high: 25 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(14))
  }, { waterBodyType: 'bay', windExposure: 'neutral' });

  assert.equal(result.confidence, 'medium');
  assert.ok(result.rangeHigh - result.rangeLow <= 4.5);
});

test('season info is split into early, mid, and late phases', () => {
  const early = estimatePseudoWaterTemperature({
    currentTime: '2026-05-05T12:00',
    latitude: 45,
    daily: buildDaily([
      { low: 7, high: 15 },
      { low: 8, high: 16 },
      { low: 8, high: 17 },
      { low: 9, high: 18 },
      { low: 10, high: 19 },
      { low: 10, high: 20 },
      { low: 11, high: 21 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(12))
  }, { waterBodyType: 'deep_lake', windExposure: 'neutral' });
  const mid = estimatePseudoWaterTemperature({
    currentTime: '2026-05-15T12:00',
    latitude: 45,
    daily: buildDaily([
      { low: 7, high: 15 },
      { low: 8, high: 16 },
      { low: 8, high: 17 },
      { low: 9, high: 18 },
      { low: 10, high: 19 },
      { low: 10, high: 20 },
      { low: 11, high: 21 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(12))
  }, { waterBodyType: 'deep_lake', windExposure: 'neutral' });
  const late = estimatePseudoWaterTemperature({
    currentTime: '2026-05-25T12:00',
    latitude: 45,
    daily: buildDaily([
      { low: 7, high: 15 },
      { low: 8, high: 16 },
      { low: 8, high: 17 },
      { low: 9, high: 18 },
      { low: 10, high: 19 },
      { low: 10, high: 20 },
      { low: 11, high: 21 }
    ]),
    hourly: buildHourlyWind(new Array(24).fill(12))
  }, { waterBodyType: 'deep_lake', windExposure: 'neutral' });

  assert.equal(early.seasonPhase, 'early');
  assert.equal(mid.seasonPhase, 'mid');
  assert.equal(late.seasonPhase, 'late');
});

test('24h, 48h, and 72h payloads with the same trailing window stay stable', () => {
  const daily = buildDaily([
    { low: 10, high: 20 },
    { low: 10, high: 21 },
    { low: 11, high: 22 },
    { low: 12, high: 23 },
    { low: 12, high: 24 },
    { low: 13, high: 25 },
    { low: 14, high: 26 }
  ]);
  const trailing = new Array(24).fill(24);
  const payload24 = estimatePseudoWaterTemperature({
    currentTime: '2026-06-07T23:59',
    latitude: 44,
    daily,
    hourly: buildHourlyWind(trailing, '2026-06-07T00:00')
  }, { waterBodyType: 'coastal', windExposure: 'offshore' });
  const payload48 = estimatePseudoWaterTemperature({
    currentTime: '2026-06-08T23:59',
    latitude: 44,
    daily,
    hourly: buildHourlyWind(new Array(24).fill(5).concat(trailing), '2026-06-07T00:00')
  }, { waterBodyType: 'coastal', windExposure: 'offshore' });
  const payload72 = estimatePseudoWaterTemperature({
    currentTime: '2026-06-09T23:59',
    latitude: 44,
    daily,
    hourly: buildHourlyWind(new Array(48).fill(5).concat(trailing), '2026-06-07T00:00')
  }, { waterBodyType: 'coastal', windExposure: 'offshore' });

  assert.equal(payload24.temp, payload48.temp);
  assert.equal(payload48.temp, payload72.temp);
});

test('paired five-day logic uses aligned complete days', () => {
  const result = estimatePseudoWaterTemperature({
    currentTime: '2026-06-07T12:00',
    latitude: 44,
    daily: [
      { date: '2026-06-01', tMin: 11, tMax: 18 },
      { date: '2026-06-02', tMin: 12, tMax: null },
      { date: '2026-06-03', tMin: 13, tMax: 26 },
      { date: '2026-06-04', tMin: 14, tMax: 27 },
      { date: '2026-06-05', tMin: 15, tMax: 28 },
      { date: '2026-06-06', tMin: 16, tMax: 29 },
      { date: '2026-06-07', tMin: 17, tMax: 30 }
    ],
    hourly: buildHourlyWind(new Array(24).fill(12))
  }, { waterBodyType: 'bay', windExposure: 'neutral' });

  assert.equal(result.available, true);
  assert.ok(result.temp >= 0);
});
