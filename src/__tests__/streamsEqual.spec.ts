import { C, marbles, X } from "../marbles.js";
import { streamsEqual } from "../streamsEqual.js";

describe("streamsEqual", () => {
  it("should return true for the same stream", async () => {
    const s = marbles`--|`;

    await expect(streamsEqual(s, s)).resolves.toBe(true);
  });

  it("should return true for identical empty stream", async () => {
    const s1 = marbles`--|`;
    const s2 = marbles`--|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical stream with values", async () => {
    const s1 = marbles`--${42}--|`;
    const s2 = marbles`--${42}--|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical stream with C symbol", async () => {
    const s1 = marbles`--${42}--|`;
    const s2 = marbles`--${42}--${C}`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical stream with values emitted at the same time", async () => {
    const s1 = marbles`--${[1, 2]}--${3}--|`;
    const s2 = marbles`--${[1, 2]}--${3}--|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical stream with values emitted at the same time in different permutation", async () => {
    const s1 = marbles`------${[1, 2, 3]}----|`;
    const s2 = marbles`------${[3, 1, 2]}----|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical failing stream with values", async () => {
    const s1 = marbles`--${42}--x`;
    const s2 = marbles`--${42}--x`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return true for an identical failing stream with X symbol", async () => {
    const s1 = marbles`--${42}--x`;
    const s2 = marbles`--${42}--${X}`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(true);
  });

  it("should return false for a stream with different values", async () => {
    const s1 = marbles`--${42}--|`;
    const s2 = marbles`--${12}--|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(false);
  });

  it("should return false for a stream with different completion times", async () => {
    const s1 = marbles`--${42}--|`;
    const s2 = marbles`--${42}----|`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(false);
  });

  it("should return false for a stream with different failing times", async () => {
    const s1 = marbles`--${42}--x`;
    const s2 = marbles`--${42}----x`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(false);
  });

  it("should return false if one stream completes and one fails", async () => {
    const s1 = marbles`--${42}--|`;
    const s2 = marbles`--${42}--x`;

    await expect(streamsEqual(s1, s2)).resolves.toBe(false);
  });
});
