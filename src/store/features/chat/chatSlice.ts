import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  isOpen: boolean;
  showLanguageModal: boolean;
  showChatForm: boolean;
  showDisclaimer: boolean;
  selectedLanguage: string | null;
}

const initialState: ChatState = {
  isOpen: false,
  showLanguageModal: false,
  showChatForm: false,
  showDisclaimer: false,
  selectedLanguage: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat(state) {
      const wasOpen = state.isOpen;
      state.isOpen = !state.isOpen;

      if (!wasOpen) {
        state.showLanguageModal = false;
        state.showChatForm = false;
      }
    },

    handleDisclaimerClick(state) {
      state.showDisclaimer = !state.showDisclaimer;
    },

    handleAmbassadorHelp(state) {
      state.showChatForm = false;
      state.showLanguageModal = true;
    },

    handleSelfCheckout(state) {
      state.showChatForm = true;
      state.showLanguageModal = false;
    },

    handleLanguageSelect(state, action: PayloadAction<string>) {
      state.selectedLanguage = action.payload;
      state.showLanguageModal = false;
      state.showChatForm = true;
    },

    handleReset(state) {
      return { ...initialState };
    },

    toggleLanguageModal(state, action: PayloadAction<boolean>) {
      state.showLanguageModal = action.payload;
    }
  },
});

export const {  
  openChat,
  handleDisclaimerClick,
  handleAmbassadorHelp,
  handleSelfCheckout,
  handleLanguageSelect,
  handleReset,
  toggleLanguageModal 
} = chatSlice.actions;
export default chatSlice.reducer;