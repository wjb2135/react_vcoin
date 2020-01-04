import Security from "@pages/uc/security";
import Authenticate from "@pages/uc/authenticate";
import Account from "@pages/uc/account/index";
import Assets from "@pages/uc/assets";
import LockStore from "@pages/uc/lockStore";
import Extension from "@pages/uc/extension";
import InvitationCode from "@pages/uc/invitationCode";
import DeviceManage from "@pages/uc/deviceManage";

export default [
  { path: "/uc/", name: "Security", component: Security, auth: true },
  { path: "/uc/security", name: "Security", component: Security, auth: true },
  { path: "/uc/account", name: "Account", component: Account, auth: true },
  { path: "/uc/authenticate", name: "Authenticate", component: Authenticate, auth: true },
  { path: "/uc/assets", name: "Assets", component: Assets, auth: true },
  { path: "/uc/lockstore", name: "LockStore", component: LockStore, auth: true },
  { path: "/uc/extension", name: "Extension", component: Extension, auth: true },
  { path: "/uc/invitation_code", name: "InvitationCode", component: InvitationCode, auth: true },
  { path: "/uc/device_manage", name: "DeviceManage", component: DeviceManage, auth: true },
];