import { FormData, StoredFormData, APIResponse, SyncResult } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'https://jsonplaceholder.typicode.com/posts';

export const sendFormDataToAPI = async (formData: FormData | StoredFormData): Promise<APIResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending data to API:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const syncPendingData = async (
  unsyncedData: StoredFormData[], 
  onProgress?: (current: number, total: number) => void
): Promise<SyncResult[]> => {
  const results: SyncResult[] = [];
  
  for (let i = 0; i < unsyncedData.length; i++) {
    const item = unsyncedData[i];
    const result = await sendFormDataToAPI(item);
    results.push({ id: item.id!, ...result });
    
    if (onProgress) {
      onProgress(i + 1, unsyncedData.length);
    }
  }
  
  return results;
};
