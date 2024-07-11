import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ActionsState {
  successStarMessage: { status: boolean; record: {} };
  successMedia: { status: boolean; record: [] };
  successMuteNotification: { status: boolean; record: {} };
  successUnmuteNotification: { status: boolean; record: {} };
  successDisappearingMessage: { status: boolean; record: {} };
  successBlockUser: { status: boolean; record: {} };
  successClearChat: { status: boolean; record: {} };
  successDeleteUser: { status: boolean; record: {} };
  successSearchMessages: { status: boolean; record: {} };
  successStoryStatus: { status: boolean; record: {} };
  successEditUser: { status: boolean; record: {} };
  successEditGroupUser: { status: boolean; record: {} };
  successLogout: { status: boolean; record: {} };
  successStarMessages: { status: boolean; record: {} };
  successCreateNewGroup: { status: boolean; record: {} };
  successAddGroupMembers: { status: boolean; record: {} };
  successUserSettings: { status: boolean; record: {} };
  successSelectChats: { status: boolean; record: {} };
  successChangePassword: { status: boolean; record: {} };
  successAddNewUsers: { status: boolean; record: {} };
  successDisplayEmoji: { status: boolean; record: {} };
  successPopup: { status: boolean; message: string; display: string };
  errorPopup: { status: boolean; message: string; display: string };
  successDeleteUserPhoto: { status: boolean; record: {} };
  successDeleteGroupUserPhoto: { status: boolean; record: {} };
  successSendImageMessage: {
    status: boolean;
    record: { selectedImage: any; message: string; saveButton: boolean };
  };
  successSendDocumentMessage: {
    status: boolean;
    record: {
      selectedImage: any;
      message: { name: string };
      saveButton: boolean;
    };
  };
  isLoading: boolean;

  //

  logoutPopup: { cmsStatus: boolean; frontEndStatus: boolean };
  userDocumentsBankPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    documentBank: any;
    id: string;
  };
  categoryPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    category: string;
    id: string;
  };

  documentsDownloadedPopup: {
    deleteStatus: boolean;
    document: string;
    id: string;
  };

  rolePopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    role: string;
    id: string;
  };

  areaOfLawPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    areaOfLaw: string;
    id: string;
  };

  subCategoryPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    subCategory: string;
    id: string;
  };

  contactPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    contact: string;
    newsLetter: boolean;
    id: string;
  };

  userPopup: {
    deleteStatus: boolean;
    viewStatus: boolean;
    editStatus: boolean;
    addStatus: boolean;
    user: string;
    id: string;
  };
}

const initialState: ActionsState = {
  successStarMessage: { status: false, record: {} },
  successMedia: { status: false, record: [] },
  successMuteNotification: { status: false, record: {} },
  successUnmuteNotification: { status: false, record: {} },
  successDisappearingMessage: { status: false, record: {} },
  successBlockUser: { status: false, record: {} },
  successClearChat: { status: false, record: {} },
  successDeleteUser: { status: false, record: {} },
  successSearchMessages: { status: false, record: {} },
  successStoryStatus: { status: false, record: {} },
  successEditUser: { status: false, record: {} },
  successEditGroupUser: { status: false, record: {} },
  successLogout: { status: false, record: {} },
  successStarMessages: { status: false, record: {} },
  successCreateNewGroup: { status: false, record: {} },
  successAddGroupMembers: { status: false, record: {} },
  successUserSettings: { status: false, record: {} },
  successSelectChats: { status: false, record: {} },
  successChangePassword: { status: false, record: {} },
  successAddNewUsers: { status: false, record: {} },
  successDisplayEmoji: { status: false, record: {} },
  successPopup: { status: false, message: "", display: "" },
  errorPopup: { status: false, message: "", display: "" },
  successDeleteUserPhoto: { status: false, record: {} },
  successDeleteGroupUserPhoto: { status: false, record: {} },
  successSendImageMessage: {
    status: false,
    record: { selectedImage: "", message: "", saveButton: false },
  },
  successSendDocumentMessage: {
    status: false,
    record: { selectedImage: "", message: { name: "" }, saveButton: false },
  },

  //

  logoutPopup: { cmsStatus: false, frontEndStatus: false },

  userDocumentsBankPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    documentBank: {},
    id: "",
  },
  categoryPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    category: "",
    id: "",
  },

  documentsDownloadedPopup: {
    deleteStatus: false,
    document: "",
    id: "",
  },

  rolePopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    role: "",
    id: "",
  },

  areaOfLawPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    areaOfLaw: "",
    id: "",
  },

  subCategoryPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    subCategory: "",
    id: "",
  },

  contactPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    contact: "",
    id: "",
    newsLetter: false,
  },

  userPopup: {
    deleteStatus: false,
    viewStatus: false,
    editStatus: false,
    addStatus: false,
    user: "",
    id: "",
  },

  isLoading: false,
};

export const ActionsSlice = createSlice({
  name: "actions",
  initialState,
  reducers: {
    successStarMessageActions: (state, action: PayloadAction<any>) => {
      state.successStarMessage = action.payload;
    },

    successMediaActions: (state, action: PayloadAction<any>) => {
      state.successMedia = action.payload;
    },
    successMuteNotificationActions: (state, action: PayloadAction<any>) => {
      state.successMuteNotification = action.payload;
    },
    successUnmuteNotificationActions: (state, action: PayloadAction<any>) => {
      state.successUnmuteNotification = action.payload;
    },
    successDisappearingMessageActions: (state, action: PayloadAction<any>) => {
      state.successDisappearingMessage = action.payload;
    },
    successBlockUserActions: (state, action: PayloadAction<any>) => {
      state.successBlockUser = action.payload;
    },
    successClearChatActions: (state, action: PayloadAction<any>) => {
      state.successClearChat = action.payload;
    },
    successDeleteUserActions: (state, action: PayloadAction<any>) => {
      state.successDeleteUser = action.payload;
    },
    successSearchMessagesActions: (state, action: PayloadAction<any>) => {
      state.successSearchMessages = action.payload;
    },

    successStoryStatusActions: (state, action: PayloadAction<any>) => {
      state.successStoryStatus = action.payload;
    },

    successEditUserActions: (state, action: PayloadAction<any>) => {
      state.successEditUser = action.payload;
    },
    successEditGroupUserActions: (state, action: PayloadAction<any>) => {
      state.successEditGroupUser = action.payload;
    },
    successAddNewUsersActions: (state, action: PayloadAction<any>) => {
      state.successAddNewUsers = action.payload;
    },

    successDisplayEmojiActions: (state, action: PayloadAction<any>) => {
      state.successDisplayEmoji = action.payload;
    },

    successDeleteUserPhotoActions: (state, action: PayloadAction<any>) => {
      state.successDeleteUserPhoto = action.payload;
    },
    successDeleteGroupUserPhotoActions: (state, action: PayloadAction<any>) => {
      state.successDeleteGroupUserPhoto = action.payload;
    },
    successSendImageMessageActions: (state, action: PayloadAction<any>) => {
      state.successSendImageMessage = action.payload;
    },

    successSendDocumentMessageActions: (state, action: PayloadAction<any>) => {
      state.successSendDocumentMessage = action.payload;
    },

    successLogoutActions: (state, action: PayloadAction<any>) => {
      state.successLogout = action.payload;
    },

    successStarMessagesActions: (state, action: PayloadAction<any>) => {
      state.successStarMessages = action.payload;
    },

    successCreateNewGroupMessagesActions: (
      state,
      action: PayloadAction<any>
    ) => {
      state.successCreateNewGroup = action.payload;
    },
    successAddGroupMembersActions: (state, action: PayloadAction<any>) => {
      state.successAddGroupMembers = action.payload;
    },

    successUserSettingsActions: (state, action: PayloadAction<any>) => {
      state.successUserSettings = action.payload;
    },

    successSelectChatsActions: (state, action: PayloadAction<any>) => {
      state.successSelectChats = action.payload;
    },
    successChangePasswordActions: (state, action: PayloadAction<any>) => {
      state.successChangePassword = action.payload;
    },

    successPopupActions: (state, action: PayloadAction<any>) => {
      state.successPopup = action.payload;
    },
    errorPopupActions: (state, action: PayloadAction<any>) => {
      state.errorPopup = action.payload;
    },

    //

    logoutPopupActions: (state, action: PayloadAction<any>) => {
      state.logoutPopup = action.payload;
    },
    userDocumentsBankPopupActions: (state, action: PayloadAction<any>) => {
      state.userDocumentsBankPopup = action.payload;
    },

    categoryPopupActions: (state, action: PayloadAction<any>) => {
      state.categoryPopup = action.payload;
    },

    rolePopupActions: (state, action: PayloadAction<any>) => {
      state.rolePopup = action.payload;
    },

    DocumentsDownloadedPopupActions: (state, action: PayloadAction<any>) => {
      state.documentsDownloadedPopup = action.payload;
    },

    areaOfLawPopupActions: (state, action: PayloadAction<any>) => {
      state.areaOfLawPopup = action.payload;
    },

    subCategoryPopupActions: (state, action: PayloadAction<any>) => {
      state.subCategoryPopup = action.payload;
    },

    contactPopupActions: (state, action: PayloadAction<any>) => {
      state.contactPopup = action.payload;
    },
    userPopupActions: (state, action: PayloadAction<any>) => {
      state.userPopup = action.payload;
    },

    hideActions: (state) => {
      state.successStarMessage = { status: false, record: {} };
      state.successMedia = { status: false, record: [] };
      state.successMuteNotification = { status: false, record: {} };
      state.successUnmuteNotification = { status: false, record: {} };
      state.successDisappearingMessage = { status: false, record: {} };
      state.successBlockUser = { status: false, record: {} };
      state.successClearChat = { status: false, record: {} };
      state.successDeleteUser = { status: false, record: {} };
      state.successSearchMessages = { status: false, record: {} };
      state.successStoryStatus = { status: false, record: {} };
      state.successEditUser = { status: false, record: {} };
      state.successEditGroupUser = { status: false, record: {} };
      state.successLogout = { status: false, record: {} };
      state.successStarMessages = { status: false, record: {} };
      state.successCreateNewGroup = { status: false, record: {} };
      state.successAddGroupMembers = { status: false, record: {} };
      state.successUserSettings = { status: false, record: {} };
      state.successSelectChats = { status: false, record: {} };
      state.successChangePassword = { status: false, record: {} };
      state.successAddNewUsers = { status: false, record: {} };
      state.successDisplayEmoji = { status: false, record: {} };
      state.successPopup = { status: false, message: "", display: "" };
      state.errorPopup = { status: false, message: "", display: "" };
      state.successDeleteUserPhoto = { status: false, record: {} };
      state.successDeleteGroupUserPhoto = { status: false, record: {} };
      state.successSendImageMessage = {
        status: false,
        record: { selectedImage: "", message: "", saveButton: false },
      };
      state.successSendDocumentMessage = {
        status: false,
        record: { selectedImage: "", message: { name: "" }, saveButton: false },
      };

      //

      state.userDocumentsBankPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        documentBank: {},
        id: "",
      };
      state.categoryPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        category: "",
        id: "",
      };

      state.rolePopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        role: "",
        id: "",
      };

      state.documentsDownloadedPopup = {
        deleteStatus: false,
        document: "",
        id: "",
      };

      state.areaOfLawPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        areaOfLaw: "",
        id: "",
      };

      state.subCategoryPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        subCategory: "",
        id: "",
      };

      state.contactPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        contact: "",
        id: "",
        newsLetter: false,
      };

      state.userPopup = {
        deleteStatus: false,
        viewStatus: false,
        editStatus: false,
        addStatus: false,
        user: "",
        id: "",
      };

      state.logoutPopup = {
        cmsStatus: false,
        frontEndStatus: false,
      };

      state.isLoading = false;
    },
    isLoadingActions: (state, action: PayloadAction<any>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  hideActions,
  successStarMessageActions,
  successDisappearingMessageActions,
  successBlockUserActions,
  successMediaActions,
  successMuteNotificationActions,
  successUnmuteNotificationActions,
  successClearChatActions,
  successDeleteUserActions,
  successSearchMessagesActions,
  successSelectChatsActions,
  successUserSettingsActions,
  successCreateNewGroupMessagesActions,
  successAddGroupMembersActions,
  successStarMessagesActions,
  successLogoutActions,
  successEditUserActions,
  successEditGroupUserActions,
  successStoryStatusActions,
  successChangePasswordActions,
  successAddNewUsersActions,
  successDisplayEmojiActions,
  successDeleteUserPhotoActions,
  successDeleteGroupUserPhotoActions,
  successSendImageMessageActions,
  successSendDocumentMessageActions,

  //
  successPopupActions,
  errorPopupActions,
  userDocumentsBankPopupActions,
  isLoadingActions,
  categoryPopupActions,
  DocumentsDownloadedPopupActions,
  rolePopupActions,
  areaOfLawPopupActions,
  subCategoryPopupActions,
  contactPopupActions,
  userPopupActions,
  logoutPopupActions,
} = ActionsSlice.actions;

export default ActionsSlice.reducer;
