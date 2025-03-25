import { RunnableVersion } from '../interfaces';

export class Bisector {
  public revList: Array<RunnableVersion>;
  public minRev: number;
  public maxRev: number;
  private pivot: number;
  private skippedVersions: Set<number>; // Track skipped versions

  constructor(revList: Array<RunnableVersion>) {
    this.getCurrentVersion = this.getCurrentVersion.bind(this);
    this.continue = this.continue.bind(this);
    this.skipVersion = this.skipVersion.bind(this);
    this.calculatePivot = this.calculatePivot.bind(this);

    this.revList = revList;
    this.minRev = 0;
    this.maxRev = revList.length - 1;
    this.skippedVersions = new Set(); // Initialize skipped versions tracker
    this.calculatePivot();
  }

  public getCurrentVersion() {
    return this.revList[this.pivot];
  }

  public continue(isGoodVersion: boolean) {
    let isBisectOver = false;
    
    if (this.maxRev - this.minRev <= 1) {
      isBisectOver = true;
    }

    if (isGoodVersion) {
      this.minRev = this.pivot;
    } else {
      this.maxRev = this.pivot;
    }

    this.calculatePivot();

    // Skip versions that are marked as skipped
    while (this.skippedVersions.has(this.pivot) && this.minRev < this.maxRev) {
      this.calculatePivot();
    }

    if (isBisectOver) {
      return [this.revList[this.minRev], this.revList[this.maxRev]];
    } else {
      return this.revList[this.pivot];
    }
  }

  public skipVersion() {
    this.skippedVersions.add(this.pivot); // Mark current version as skipped
    this.calculatePivot();

    // Skip all skipped versions
    while (this.skippedVersions.has(this.pivot) && this.minRev < this.maxRev) {
      this.calculatePivot();
    }

    return this.getCurrentVersion();
  }

  private calculatePivot() {
    this.pivot = Math.floor((this.maxRev - this.minRev) / 2) + this.minRev;
  }
}
