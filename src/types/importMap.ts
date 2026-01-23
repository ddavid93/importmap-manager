export interface IModuleInfo {
  module_name: string;
  domain: string;
  isOverride: boolean;
  scope: Record<string, string> | null;
}

export interface IOverrideInfo {
  name: string;
  url: string;
  enabled: boolean;
  scope: Record<string, string> | null;
}

export interface IImportMap {
  imports: Record<string, string>;
  scopes: Record<string, Record<string, string>>;
}

export interface IOverrideTemplate {
  name: string;
  items: IOverrideInfo[];
}

export type OverridesTableColumnKeyType = "module_name" | "domain";

export interface IOverridesTableColumn {
  key: OverridesTableColumnKeyType;
  label: string;
}