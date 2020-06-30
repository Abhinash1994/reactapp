import { FuseLoadable } from "@fuse";
import { AllVoucherPath } from "app/links/commonLinks";
export const AccountingConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/accounting",
      component: FuseLoadable({
        loader: () => import("./index"),
      }),
    },
    {
      path: "/daybook",
      component: FuseLoadable({
        loader: () => import("./DayBook"),
      }),
    },
    {
      path: "/cashbook",
      component: FuseLoadable({
        loader: () => import("./CashBook"),
      }),
    },
    {
      path: AllVoucherPath,
      component: FuseLoadable({
        loader: () => import("./AllVoucher"),
      }),
    },
  ],
};
