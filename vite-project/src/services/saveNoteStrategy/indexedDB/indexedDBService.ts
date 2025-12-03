import type { Note } from '../../../types'

// Database configuration
const DB_NAME = 'NotesExtensionDB'
const DB_VERSION = 1
const STORE_NOTES = 'notes'
const STORE_METADATA = 'metadata'


/**
 * IndexedDB Service - A comprehensive service demonstrating IndexedDB features
 * 
 * Key IndexedDB concepts demonstrated:
 * - Database opening and versioning
 * - Object stores (like tables in SQL)
 * - Transactions (for data integrity)
 * - CRUD operations (Create, Read, Update, Delete)
 * - Error handling
 */

class IndexedDBService {
  private db: IDBDatabase | null = null
  private initPromise: Promise<IDBDatabase> | null = null

  
  /**
   * Opens the database and handles version upgrades
   * Returns a promise that resolves when the database is ready
  */
  private async openDatabase(): Promise<IDBDatabase> {
    // If database is already open, return it
    if (this.db) {
      return this.db
    }

    // If initialization is in progress, wait for it
    if (this.initPromise) {
      await this.initPromise
      if (!this.db) {
        throw new Error('Database initialization failed')
      }
      return this.db
    }

    // Start initialization
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      // This fires when the database is first created or version changes
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store for notes if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NOTES)) {
          // 'id' is the keyPath - IndexedDB will automatically use the 'id' property as the key
          const notesStore = db.createObjectStore(STORE_NOTES, { keyPath: 'id' })
          
          // Create an index on 'text' field for searching (optional but useful)
          notesStore.createIndex('text', 'text', { unique: false })
        }

        // Create object store for metadata (like lastNoteId)
        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          db.createObjectStore(STORE_METADATA, { keyPath: 'key' })
        }
      }

      request.onsuccess = () => {
        this.db = request.result
        
        // Handle database close event
        this.db.onclose = () => {
          this.db = null
          this.initPromise = null
        }

        // Handle errors that occur after database is open
        this.db.onerror = (event) => {
          console.error('Database error:', event)
        }

        resolve(this.db)
      }

      request.onerror = () => {
        this.initPromise = null
        reject(new Error(`Failed to open database: ${request.error?.message}`))
      }
    })

    return this.initPromise
  }

  /**
   * Helper method to wrap IndexedDB requests in Promises
   * This makes async/await syntax much cleaner
   */
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as T)
      request.onerror = () => reject(new Error(`Request failed: ${request.error?.message}`))
    })
  }

  /**
   * Initialize the database connection
   * Call this once when your app starts
   */
  async init(): Promise<void> {
    await this.openDatabase()
  }

  /**
   * CREATE operation - Add a new note
   * Uses 'add' which will fail if a note with the same id already exists
   */
  async addNote(note: Note): Promise<void> {
    const db = await this.openDatabase()
    
    // Start a transaction - 'readwrite' allows both read and write operations
    const transaction = db.transaction([STORE_NOTES], 'readwrite')
    const store = transaction.objectStore(STORE_NOTES)
    
    // Add the note (will fail if id already exists)
    const request = store.add(note)
    await this.promisifyRequest(request)
  }

  /**
   * CREATE/UPDATE operation - Save a note (adds if new, updates if exists)
   * Uses 'put' which will overwrite if the id already exists
   */
  async putNote(note: Note): Promise<void> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readwrite')
    const store = transaction.objectStore(STORE_NOTES)
    
    // Put will add if new, or update if exists
    const request = store.put(note)
    await this.promisifyRequest(request)
  }

  /**
   * READ operation - Get a single note by id
   */
  async getNote(id: number): Promise<Note | undefined> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readonly')
    const store = transaction.objectStore(STORE_NOTES)
    
    const request = store.get(id)
    return await this.promisifyRequest<Note | undefined>(request)
  }

  /**
   * READ operation - Get all notes
   * Uses getAll() which is more efficient than iterating
   */
  async getAllNotes(): Promise<Note[]> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readonly')
    const store = transaction.objectStore(STORE_NOTES)
    
    const request = store.getAll()
    return await this.promisifyRequest<Note[]>(request) || []
  }

  /**
   * UPDATE operation - Update an existing note
   * Note: put() can also be used for updates, but this is more explicit
   */
  async updateNote(note: Note): Promise<void> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readwrite')
    const store = transaction.objectStore(STORE_NOTES)
    
    // Put will update if exists, or add if new
    const request = store.put(note)
    await this.promisifyRequest(request)
  }

  /**
   * DELETE operation - Remove a note by id
   */
  async deleteNote(id: number): Promise<void> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readwrite')
    const store = transaction.objectStore(STORE_NOTES)
    
    const request = store.delete(id)
    await this.promisifyRequest(request)
  }

  /**
   * DELETE operation - Clear all notes
   */
  async clearAllNotes(): Promise<void> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readwrite')
    const store = transaction.objectStore(STORE_NOTES)
    
    const request = store.clear()
    await this.promisifyRequest(request)
  }

  /**
   * Advanced: Count notes using a cursor
   * Demonstrates cursor usage (alternative to getAll)
   */
  async countNotes(): Promise<number> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readonly')
    const store = transaction.objectStore(STORE_NOTES)
    
    return new Promise((resolve, reject) => {
      const request = store.count()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error(`Count failed: ${request.error?.message}`))
    })
  }

  /**
   * Advanced: Search notes by text using an index
   * Demonstrates index usage for efficient queries
   */
  async searchNotesByText(searchText: string): Promise<Note[]> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_NOTES], 'readonly')
    const store = transaction.objectStore(STORE_NOTES)
    const index = store.index('text')
    
    const results: Note[] = []
    const request = index.openCursor()
    
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
        if (cursor) {
          const note = cursor.value as Note
          // Simple text matching (you could use more sophisticated search)
          if (note.text.toLowerCase().includes(searchText.toLowerCase())) {
            results.push(note)
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }
      request.onerror = () => reject(new Error(`Search failed: ${request.error?.message}`))
    })
  }

  /**
   * Metadata operations - Store and retrieve key-value pairs
   * Useful for storing things like lastNoteId, settings, etc.
   */
  async setMetadata(key: string, value: any): Promise<void> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_METADATA], 'readwrite')
    const store = transaction.objectStore(STORE_METADATA)
    
    const request = store.put({ key, value })
    await this.promisifyRequest(request)
  }

  async getMetadata(key: string): Promise<any> {
    const db = await this.openDatabase()
    const transaction = db.transaction([STORE_METADATA], 'readonly')
    const store = transaction.objectStore(STORE_METADATA)
    
    const request = store.get(key)
    const result = await this.promisifyRequest<{ key: string; value: any } | undefined>(request)
    return result?.value
  }

  /**
   * Close the database connection
   * Usually not needed, but useful for cleanup
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
    }
  }
}

// Export a singleton instance
const indexedDBService = new IndexedDBService()
export default indexedDBService

