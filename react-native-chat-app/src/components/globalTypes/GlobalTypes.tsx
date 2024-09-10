export interface UserRecordInterface {
  name: string;
  email: string;
  message: string;
  status: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  lastSeen: {
    status: boolean;
    date: Date | string | number;
  };
  preferLanguage: {
    language: string;
    isoCode: string;
  };
}
export interface UserInterface {
  user: {
    name: string;
    email: string;
    message: string;
    status: string;
    photoUrl: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
    lastSeen: {
      status: boolean;
      date: Date | string | number;
    };
    preferLanguage: {
      language: string;
      isoCode: string;
    };
  };
  stories: [];
  blockStatus: boolean;
  muteNotification: string;
  _id: "";
  status: boolean;
  muteDate: Date | string | number;
  isGroup: boolean;
  disappearIn: string;
  updatedAt: Date | string | number;
  group: {
    name: string;
    status: string;
    photoUrl: string;
    creator: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    disappearIn: string;
    _id: string;
  };
  admin: boolean;
}

export const UserInterfaceInfo: UserInterface = {
  user: {
    name: "",
    email: "",
    message: "",
    status: "",
    photoUrl: "",
    createdAt: "",
    updatedAt: "",
    _id: "",
    lastSeen: {
      status: false,
      date: "",
    },
    preferLanguage: {
      language: "",
      isoCode: "",
    },
  },
  stories: [],
  blockStatus: false,
  muteNotification: "none",
  _id: "",
  status: false,
  muteDate: "",
  isGroup: false,
  updatedAt: "",
  disappearIn: "",
  group: {
    name: "",
    status: "",
    photoUrl: "",
    creator: "",
    description: "",
    createdAt: "",
    updatedAt: "",
    disappearIn: "",
    _id: "",
  },
  admin: false,
};
