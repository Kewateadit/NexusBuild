export interface WallSegment {
    start: { x: number; y: number };
    end: { x: number; y: number };
}

export interface ReconstructionData {
    segments: WallSegment[];
    width: number;
    height: number;
    metadata?: {
        generated_at: string;
        version: string;
        scale?: number;
    };
}

export interface Project {
    id: string;
    user_id: string;
    project_name: string;
    floorplan_url: string;
    reconstruction_data: ReconstructionData;
    created_at: string;
    updated_at: string;
    thumbnail_url?: string;
}
