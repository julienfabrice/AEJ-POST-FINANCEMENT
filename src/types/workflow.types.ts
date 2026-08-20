export interface WORKFLOW_ETAPE_T {
    id: number;
    workflow_version: string;
    parent_etape_code: string | null;
    code: string;
    name: string;
    impact: string;
    statut: string;
    description: string;
    order: number;
    is_active: boolean;
    valid_from: string;
    valid_to: string | null;
    created_at: string;
    updated_at: string;
}

export interface WORKFLOW_BASE_T {
    id: number;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface WORKFLOW_VERSION_T {
    id: number;
    workflow_code: string;
    version: string;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    is_default: boolean;
    created_at: string;
    updated_at: string;
    workflow: WORKFLOW_BASE_T;
    etapes: WORKFLOW_ETAPE_T[];
}
