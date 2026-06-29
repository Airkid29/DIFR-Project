/*
  All extracted TypeScript interfaces from the frontend codebase.
  Each exported interface is prefixed by the source file (folder and file name)
  and includes a comment stating the original interface name and source path.

  Purpose: provide a single file to submit to another AI for design improvements.
*/

// -----------------------------------------------------------------------------
// Source: src/pages/Timeline.tsx
// Original interface: TimelineEvent
// -----------------------------------------------------------------------------
export interface Timeline_TimelineEvent {
  // Original name: TimelineEvent
  id: string | number;
  incident_id: string;
  timestamp: string;
  category: "network" | "process" | "auth" | "malware" | "system";
  title: string;
  details: string;
  source: string;
  importance: "high" | "medium" | "low";
}

// -----------------------------------------------------------------------------
// Source: src/pages/Timeline.tsx
// Original interface: Incident
// -----------------------------------------------------------------------------
export interface Timeline_Incident {
  // Original name: Incident
  id: string;
  title: string;
  severity: string;
}

// -----------------------------------------------------------------------------
// Source: src/pages/AuditLog.tsx
// Original interface: AuditEntry
// -----------------------------------------------------------------------------
export interface AuditLog_AuditEntry {
  // Original name: AuditEntry
  id: string;
  time: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: "success" | "failure";
}

// -----------------------------------------------------------------------------
// Source: src/components/NotificationDrawer.tsx
// Original interface: Notification
// -----------------------------------------------------------------------------
export interface NotificationDrawer_Notification {
  // Original name: Notification
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// -----------------------------------------------------------------------------
// Source: src/components/NotificationDrawer.tsx
// Original interface: NotificationDrawerProps
// -----------------------------------------------------------------------------
export interface NotificationDrawer_Props {
  // Original name: NotificationDrawerProps
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationDrawer_Notification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

// -----------------------------------------------------------------------------
// Source: src/pages/Incidents.tsx
// Original interface: Incident
// -----------------------------------------------------------------------------
export interface Incidents_Incident {
  // Original name: Incident
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "triage" | "resolved";
  owner_id: number | null;
  created_at: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Source: src/pages/Evidence.tsx
// Original interface: CustodyHistory
// -----------------------------------------------------------------------------
export interface Evidence_CustodyHistory {
  // Original name: CustodyHistory
  id: number;
  evidence_id: string;
  date: string;
  transfer_from: string;
  transfer_to: string;
  action_taken: string;
}

// -----------------------------------------------------------------------------
// Source: src/pages/Evidence.tsx
// Original interface: EvidenceItem
// -----------------------------------------------------------------------------
export interface Evidence_EvidenceItem {
  // Original name: EvidenceItem
  id: string;
  name: string;
  category: string;
  collector: string;
  date_collected: string;
  sha256_hash: string;
  sha1_hash?: string;
  md5_hash?: string;
  custodian: string;
  location: string;
  verified: boolean;
  custody_chain: Evidence_CustodyHistory[];
}

// -----------------------------------------------------------------------------
// Source: src/components/CommandPalette.tsx
// Original interface: CommandPaletteProps
// -----------------------------------------------------------------------------
export interface CommandPalette_Props {
  // Original name: CommandPaletteProps
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

// -----------------------------------------------------------------------------
// Source: src/components/Layout.tsx
// Original interface: Notification
// -----------------------------------------------------------------------------
export interface Layout_Notification {
  // Original name: Notification
  id: string;
  type: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// -----------------------------------------------------------------------------
// Source: src/pages/Users.tsx
// Original interface: TeamMember
// -----------------------------------------------------------------------------
export interface Users_TeamMember {
  // Original name: TeamMember
  id: string | number;
  name: string;
  email: string;
  role: string;
  mfaEnabled?: boolean;
  mfa_enabled?: boolean;
  lastLogin?: string;
  is_active?: boolean;
}

/* End of file - allInterfaces.ts */
