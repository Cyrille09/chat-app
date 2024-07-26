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
      date: any;
    };
    preferLanguage: {
      language: string;
      isoCode: string;
    };
  };
  blockStatus: boolean;
  muteNotification: string;
  _id: "";
  status: boolean;
  muteDate: any;
  isGroup: boolean;
  disappearIn: string;
  updatedAt: any;
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
  blockStatus: false,
  muteNotification: "none",
  _id: "",
  status: false,
  muteDate: null,
  isGroup: false,
  updatedAt: null,
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
};
