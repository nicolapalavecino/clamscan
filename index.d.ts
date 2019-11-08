declare module 'clamscan/types' {
  import { Stream } from 'stream';
  
  export interface NodeClam {
    new (): { init: (opts: Options) => Promise<ClamScan> };
  }
  
  export interface ClamScan {
    version: CallbackedVersion & PromisedVersion;
    is_infected: CallbackedIsInfected & PromisedIsInfected;
    scan_dir: CallbackedScanDir & PromisedScanDir;
    scan_files: CallbackedScanFiles & PromisedScanFiles;
    scan_stream: CallbackedScanStream & PromisedScanStream;
    passthrough: () => Stream;
  }
  
  // Options interface
  export interface Options {
    remove_infected?: boolean; // If true, removes infected files
    quarantine_infected?: boolean; // False: Don't quarantine, Path: Moves files to this place.
    scan_log?: string | null; // Path to a writeable log file to write scan results into
    debug_mode?: boolean; // Whether or not to log info/debug/error msgs to the console
    file_list?: string | null; // path to file containing list of files to scan (for scan_files method)
    scan_recursively?: boolean; // If true, deep scan folders recursively
    clamscan?: {
      path?: string; // Path to clamscan binary on your server
      db?: string | null; // Path to a custom virus definition database
      scan_archives?: boolean; // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
      active?: boolean; // If true, this module will consider using the clamscan binary
    };
    clamdscan?: {
      socket?: boolean; // Socket file for connecting via TCP
      host?: boolean; // IP of host to connect to TCP interface
      port?: boolean; // Port of host to use when connecting via TCP interface
      timeout?: number; // Timeout for scanning files
      local_fallback?: boolean; // Do no fail over to binary-method of scanning
      path?: string; // Path to the clamdscan binary on your server
      config_file?: string | null; // Specify config file if it's in an unusual place
      multiscan?: boolean; // Scan using all available cores! Yay!
      reload_db?: boolean; // If true, will re-load the DB on every call (slow)
      active?: boolean; // If true, this module will consider using the clamdscan binary
      bypass_test?: boolean; // Check to see if socket is available when applicable
    };
    preference?: string;
  }
  
  // Functions typing
  export type CallbackedVersion = (cb: VersionCallback) => void;
  export type PromisedVersion = () => Promise<string>;
  export type CallbackedIsInfected = (
    file_path: string,
    cb: IsInfectedCallback
  ) => void;
  export type PromisedIsInfected = (file_path: string) => Promise<IsInfectedResult>;
  export type CallbackedScanDir = (
    dir_path: string,
    end_cb: ScanDirEndCallback,
    file_cb: ScanDirFileCallback
  ) => void;
  export type PromisedScanDir = (dir_path: string) => Promise<ScanDirResult>;
  export type CallbackedScanFiles = (
    files: string[],
    end_cb: ScanFilesEndCallback,
    file_cb: ScanFilesFileCallback
  ) => void;
  export type PromisedScanFiles = (files: string[]) => Promise<ScanFilesResult>;
  export type CallbackedScanStream = (stream: Stream, cb: ScanStreamCallback) => void;
  export type PromisedScanStream = (stream: Stream) => Promise<ScanStreamResult>;
  
  // Results typing
  export interface IsInfectedResult {
    file: string; // The original file_path passed into the is_infected method.
    is_infected: boolean | null; // True: File is infected; False: File is clean. NULL: Unable to scan.
    viruses: string[]; // An array of any viruses found in the scanned file.
  }
  export interface ScanDirResult {
    path: string; // The original dir_path passed into the scan_dir method.
    is_infected: boolean | null; // True: File is infected; False: File is clean. NULL: Unable to scan.
    good_files: string[]; // List of the full paths to all files that are clean.
    bad_files: string[]; // List of the full paths to all files that are infected.
    viruses: string[]; // List of all the viruses found (feature request: associate to the bad files).
  }
  export interface ScanFilesResult {
    good_files: string[]; // List of the full paths to all files that are clean.
    bad_files: string[]; // List of the full paths to all files that are infected.
    errors: {}; // Per-file errors keyed by the filename in which the error happened. (ex. {'foo.txt': Error})
    viruses: string[]; // List of all the viruses found (feature request: associate to the bad files).
  }
  export interface ScanStreamResult {
    good_files: string[]; // List of the full paths to all files that are clean.
    bad_files: string[]; // List of the full paths to all files that are infected.
    errors: {}; // Per-file errors keyed by the filename in which the error happened. (ex. {'foo.txt': Error})
    viruses: string[]; // List of all the viruses found (feature request: associate to the bad files).
  }
  
  // Callbacks typing
  export type VersionCallback = (err: {} | null, version: string) => void;
  export type IsInfectedCallback = (
    err: {} | null,
    file: string,
    is_infected: boolean,
    viruses: string[]
  ) => void;
  export type ScanDirEndCallback = (
    err: {} | null,
    good_files: string[],
    bad_files: string[],
    viruses: string[]
  ) => void;
  export type ScanDirFileCallback = (
    err: {} | null,
    file: string,
    is_infected: boolean | null
  ) => void;
  export type ScanFilesEndCallback = (
    err: {} | null,
    good_files: string[],
    bad_files: string[]
  ) => void;
  export type ScanFilesFileCallback = (
    err: {} | null,
    file: string,
    is_infected: boolean | null
  ) => void;
  export type ScanStreamCallback = (
    err: {} | null,
    is_infected: boolean | null
  ) => void;
}

declare module 'clamscan' {
  import { NodeClam } from 'clamscan/types';
  const clamscan: NodeClam;
  export = clamscan;
}
