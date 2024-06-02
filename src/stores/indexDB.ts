interface DBChunk {
    id?: number;
    data: Blob;
  }
  
 export function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("fileUploadDB", 1);
  
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("chunks")) {
          db.createObjectStore("chunks", { autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve((request as IDBOpenDBRequest).result);
    });
  }

 export async function saveChunk(chunk: Blob): Promise<number> {
    const db = await openDatabase();
    const transaction = db.transaction("chunks", "readwrite");
    const store = transaction.objectStore("chunks");
  
    return new Promise((resolve, reject) => {
      let request = store.add(chunk);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

 export async function getChunk(key: number): Promise<Blob> {
    const db = await openDatabase();
    const transaction = db.transaction("chunks", "readonly");
    const store = transaction.objectStore("chunks");
  
    return new Promise((resolve, reject) => {
      let request = store.get(key);
      request.onsuccess = () => resolve(request.result as Blob);
      request.onerror = () => reject(request.error);
    });
  }

 export async function uploadChunkFromDB(key: number): Promise<void> {
    const chunk = await getChunk(key);
    const response = await fetch('/upload', {
      method: 'POST',
      body: chunk
    });
  
    if (!response.ok) {
      console.error("Ошибка при загрузке чанка");
    } else {
      console.log("Чанк успешно загружен на сервер");
    }
  }

  export async function clearObjectStore(storeName: string): Promise<void> {
    const db = await openDatabase(); // Предполагается, что функция openDatabase уже определена
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }