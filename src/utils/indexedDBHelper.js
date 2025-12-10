// IndexedDB Helper for offline caching of course data

const DB_NAME = 'StudlyCourseBankDB';
const DB_VERSION = 1;
const TOPICS_STORE = 'topics';
const PROGRESS_STORE = 'progress';
const NOTES_STORE = 'notes';
const EVENTS_STORE = 'events';

// Initialize IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(TOPICS_STORE)) {
        db.createObjectStore(TOPICS_STORE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'topicId' });
      }

      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        db.createObjectStore(NOTES_STORE, { keyPath: 'topicId' });
      }

      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const eventStore = db.createObjectStore(EVENTS_STORE, { keyPath: 'id', autoIncrement: true });
        eventStore.createIndex('timestamp', 'timestamp', { unique: false });
        eventStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
};

// Topic caching functions
export const cacheTopic = async (topic) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TOPICS_STORE], 'readwrite');
    const store = transaction.objectStore(TOPICS_STORE);

    await store.put({
      ...topic,
      cachedAt: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error caching topic:', error);
    return false;
  }
};

export const getCachedTopic = async (topicId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TOPICS_STORE], 'readonly');
    const store = transaction.objectStore(TOPICS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(topicId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached topic:', error);
    return null;
  }
};

export const getAllCachedTopics = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TOPICS_STORE], 'readonly');
    const store = transaction.objectStore(TOPICS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting all cached topics:', error);
    return [];
  }
};

// Progress caching functions
export const cacheProgress = async (topicId, progressData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);

    await store.put({
      topicId,
      ...progressData,
      lastUpdated: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error caching progress:', error);
    return false;
  }
};

export const getCachedProgress = async (topicId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(topicId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached progress:', error);
    return null;
  }
};

// Notes caching functions
export const cacheNotes = async (topicId, content) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([NOTES_STORE], 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);

    await store.put({
      topicId,
      content,
      lastUpdated: Date.now()
    });

    return true;
  } catch (error) {
    console.error('Error caching notes:', error);
    return false;
  }
};

export const getCachedNotes = async (topicId) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([NOTES_STORE], 'readonly');
    const store = transaction.objectStore(NOTES_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(topicId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached notes:', error);
    return null;
  }
};

// Event queue functions (for offline sync)
export const queueEvent = async (eventType, data) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);

    await store.add({
      type: eventType,
      data,
      timestamp: Date.now(),
      synced: false
    });

    return true;
  } catch (error) {
    console.error('Error queuing event:', error);
    return false;
  }
};

export const getUnsyncedEvents = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const store = transaction.objectStore(EVENTS_STORE);
    const index = store.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting unsynced events:', error);
    return [];
  }
};

export const markEventsSynced = async (eventIds) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);

    for (const id of eventIds) {
      const event = await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (event) {
        event.synced = true;
        event.syncedAt = Date.now();
        await store.put(event);
      }
    }

    return true;
  } catch (error) {
    console.error('Error marking events as synced:', error);
    return false;
  }
};

export const clearSyncedEvents = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const index = store.index('synced');

    return new Promise((resolve, reject) => {
      const request = index.openCursor(true);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve(true);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing synced events:', error);
    return false;
  }
};

// Clear all cached data
export const clearAllCache = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TOPICS_STORE, PROGRESS_STORE, NOTES_STORE, EVENTS_STORE], 'readwrite');

    await Promise.all([
      transaction.objectStore(TOPICS_STORE).clear(),
      transaction.objectStore(PROGRESS_STORE).clear(),
      transaction.objectStore(NOTES_STORE).clear(),
      transaction.objectStore(EVENTS_STORE).clear()
    ]);

    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

// Check cache size (for debugging)
export const getCacheSize = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TOPICS_STORE, PROGRESS_STORE, NOTES_STORE, EVENTS_STORE], 'readonly');

    const counts = await Promise.all([
      new Promise((resolve) => {
        const request = transaction.objectStore(TOPICS_STORE).count();
        request.onsuccess = () => resolve(request.result);
      }),
      new Promise((resolve) => {
        const request = transaction.objectStore(PROGRESS_STORE).count();
        request.onsuccess = () => resolve(request.result);
      }),
      new Promise((resolve) => {
        const request = transaction.objectStore(NOTES_STORE).count();
        request.onsuccess = () => resolve(request.result);
      }),
      new Promise((resolve) => {
        const request = transaction.objectStore(EVENTS_STORE).count();
        request.onsuccess = () => resolve(request.result);
      })
    ]);

    return {
      topics: counts[0],
      progress: counts[1],
      notes: counts[2],
      events: counts[3]
    };
  } catch (error) {
    console.error('Error getting cache size:', error);
    return null;
  }
};
