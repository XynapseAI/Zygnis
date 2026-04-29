import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InventoryItem {
  cardId: string;
  quantity: number;
}


interface GameState {
  zyg: number;
  tapsToday: number;
  lastTapDate: string;
  inventory: InventoryItem[];
  
  addZyg: (amount: number) => void;
  incrementTaps: () => void;
  addCard: (cardId: string) => void;
  burnCard: (cardId: string, quantity: number, zygAmount: number) => void;
  checkAndResetDaily: () => void;
  
  syncWithServer: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      zyg: 0,
      tapsToday: 0,
      lastTapDate: new Date().toISOString().split('T')[0],
      inventory: [],
      
      addZyg: (amount) => set((state) => ({ zyg: state.zyg + amount })),
      incrementTaps: () => {
        const state = get();
        set({ tapsToday: state.tapsToday + 1 });
        if ((state.tapsToday + 1) % 50 === 0) {
          get().syncWithServer();
        }
      },
      addCard: (cardId) => {
        set((state) => {
          const existing = state.inventory.find(i => i.cardId === cardId);
          if (existing) {
            return {
              inventory: state.inventory.map(i => 
                i.cardId === cardId ? { ...i, quantity: i.quantity + 1 } : i
              )
            };
          }
          return { inventory: [...state.inventory, { cardId, quantity: 1 }] };
        });
        get().syncWithServer();
      },
      burnCard: (cardId, quantity, zygAmount) => {
        set((state) => {
          const item = state.inventory.find(i => i.cardId === cardId);
          if (!item || item.quantity < quantity) return state;

          const newInventory = state.inventory
            .map(i => i.cardId === cardId ? { ...i, quantity: i.quantity - quantity } : i)
            .filter(i => i.quantity > 0);

          return {
            zyg: state.zyg + zygAmount,
            inventory: newInventory
          };
        });
        get().syncWithServer();
      },
      checkAndResetDaily: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().lastTapDate !== today) {
          set({ tapsToday: 0, lastTapDate: today });
        }
      },
      
      syncWithServer: async () => {
        const state = get();
        // Skip sync if not logged in. Wait, Zustand doesn't have session token anymore, it's handled via cookies.
        // We will just hit the endpoint. If it returns 401, we know they aren't logged in.
        try {
          const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              zyg: state.zyg,
              tapsToday: state.tapsToday,
              lastTapDate: state.lastTapDate,
              inventory: state.inventory,
            })
          });
          if (!response.ok && response.status !== 401) {
            console.error('Failed to sync with server');
          }
        } catch (error) {
          console.error('Network error during sync', error);
        }
      },
      
      loadUserData: async () => {
        try {
          const response = await fetch('/api/user');
          if (response.ok) {
            const data = await response.json();
            set({
              zyg: data.zyg,
              tapsToday: data.tapsToday,
              lastTapDate: data.lastTapDate,
              inventory: data.inventory.map((item: any) => ({
                cardId: item.cardId,
                quantity: item.quantity
              }))
            });
          }
        } catch (error) {
          console.error('Failed to load user data', error);
        }
      }
    }),
    {
      name: 'yugioh-tap-storage',
    }
  )
);

