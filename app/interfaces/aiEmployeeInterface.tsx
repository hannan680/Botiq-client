export interface AiEmployee {
    _id: string;
    role: string;
    aiName: string;
    industryName: string;
    mainPrompt: string;
    customFields: string[];
    image?: string;
    status: 'draft' | 'published';
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }